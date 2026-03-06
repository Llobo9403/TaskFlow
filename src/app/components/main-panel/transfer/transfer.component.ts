import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitleGroup, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TransferDialogResult } from '../../../shared/models/movement-model/movement-model.model';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { NgIf } from "../../../../../node_modules/@angular/common/common_module.d-NEF7UaHr";
import { BankService } from '../../../services/bank/bank.service';

@Component({
  selector: 'app-transfer',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitleGroup, MatCardTitle, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent implements OnInit {
  income: number = 0;
  balanceValue: number = 0;

  constructor(private dialog: MatDialog, private bankService: BankService) { }

  ngOnInit() {
    this.getAccountDetails();
  }

  fazerTransferencia() {
    const ref = this.dialog.open(TransactionDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        type: 'transfer',
        title: 'Enviar TED'
      }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      this.getAccountDetails();
    });
  }

  trazerDinheiro() {
    const ref = this.dialog.open(TransactionDialogComponent, {
      width: '520px',
      disableClose: true,
      data: {
        type: 'deposit',
        title: 'Trazer Dinheiro'
      }
    });
  
    ref.afterClosed().subscribe(result => {
      if (!result) return;
    
      this.getAccountDetails();
    });
  }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getAccountDetails() {
    return this.bankService.getConta().subscribe(conta => {
      const saldo = conta?.balance ?? 0;
      this.balanceValue = saldo;
    });
  }
}
