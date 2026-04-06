import { Component, OnInit } from '@angular/core';
import { Movement } from '../../../models/movement-model.model';
import { BankService } from '../../../services/bank/bank.service';
import { MatTableModule } from '@angular/material/table';
import { BrlFormatPipe } from "../../../shared/pipes/brl/brl-format.pipe";
import { TransactionTypePipeTsPipe } from "../../../shared/pipes/transaction-type/transaction-type.pipe.ts.pipe";
import { DatePipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BalanceDialogComponent } from './balance-dialog/balance-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-balance',
  imports: [MatTableModule, BrlFormatPipe, TransactionTypePipeTsPipe, DatePipe, MatIcon, MatMenuModule, MatInputModule, ReactiveFormsModule, TranslatePipe],
  standalone: true,
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent implements OnInit {
  displayedColumns: string[] = ['Data', 'Tipo' ,'Descricao', 'Valor', 'Acoes'];
  dataSource: Movement[] = [];
  form: FormGroup
  currentLang: string;
  translate: any;

  constructor(
    private bankService: BankService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      term: ['']
    })
    const savedLang = localStorage.getItem('app-lang') || 'pt-BR';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  ngOnInit() {
    this.popularTabela();
  }

  popularTabela(){
      this.bankService.getMovements().subscribe((response: Movement[]) => {
        this.dataSource = response
      });
    }

  editarDescricao(item: Movement): void {
    const dialogRef = this.dialog.open(BalanceDialogComponent, {
      width: '400px',
      data: { movement: item }
    });
    dialogRef.afterClosed().subscribe((resultado) => {
      console.log('resultado do dialog:', resultado);
      console.log('tipo do resultado:', typeof resultado);
      console.log('item.id:', item.id);
      const novaDescricao =
        typeof resultado === 'string'
          ? resultado
          : resultado?.description;

      if (!novaDescricao || novaDescricao === item.description) {
        return;
      }
      this.bankService.editDescription(item.id, novaDescricao).subscribe({
        next: (movementAtualizado) => {
          console.log('retorno do patch:', movementAtualizado);
          item.description = movementAtualizado.description;
          this.dataSource = [...this.dataSource];
        },
        error: (err) => {
          console.error('Erro ao atualizar descrição:', err);
        }
      });
    });
  }
}
