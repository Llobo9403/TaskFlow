import { Component, OnInit } from '@angular/core';
import { Movement } from '../../../shared/models/movement-model/movement-model.model';
import { BankService } from '../../../services/bank/bank.service';
import { MatTableModule } from '@angular/material/table';
import { BrlFormatPipe } from "../../../shared/pipes/brl/brl-format.pipe";
import { TransactionTypePipeTsPipe } from "../../../shared/pipes/transaction-type/transaction-type.pipe.ts.pipe";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-balance',
  imports: [MatTableModule, BrlFormatPipe, TransactionTypePipeTsPipe, DatePipe],
  standalone: true,
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent implements OnInit {
  displayedColumns: string[] = ['Data', 'Descricao', 'Valor'];
  dataSource: Movement[] = [];

  constructor(
    private bankService: BankService
    
  ) { }

  ngOnInit() {
    this.popularTabela();
  }

  popularTabela(){
      this.bankService.getMovements().subscribe((response: Movement[]) => {
        this.dataSource = response
      });
    }
}
