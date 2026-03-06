import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BankService } from '../../../services/bank/bank.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TransactionTypePipeTsPipe } from "../../../shared/pipes/transaction-type/transaction-type.pipe.ts.pipe";
import { BrlFormatPipe } from '../../../shared/pipes/brl/brl-format.pipe';
import { Movement } from '../../../shared/models/movement-model/movement-model.model';
import { CurrencyPipe, DatePipe } from '@angular/common';


const map: Record<string, string> = {
  'deposit': 'Depósito',
  'transfer': 'Transferência',
}

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatCardModule, FormsModule, TransactionTypePipeTsPipe, BrlFormatPipe, DatePipe],
  providers: [HttpClient],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  username: string = '';
  balanceValue: number = 0;
  income: number = 0;
  expense: number = 0;
  displayedColumns: string[] = ['Data', 'Tipo' ,'Descricao', 'Valor'];
  dataSource: Movement[] = [];
  receita: Movement[] = [];
  despesa: Movement[] = [];
  
  ngOnInit() {
    this.getAccount();
    this.popularTabela();
  }

  constructor(private readonly bankService: BankService) {

  }

  getAccount(){
    this.bankService.getConta().subscribe((response: any) => {
      this.username = response.username;
      this.balanceValue = response.balance;
    });
  }
  popularTabela(){
    this.bankService.getMovements().subscribe((response: Movement[]) => {
      this.dataSource = response.filter(movement => {
        const movementDate = new Date(movement.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return movementDate >= thirtyDaysAgo;
      });

      this.receita = this.dataSource.filter(movement => movement.type === 'deposit');
      this.despesa = this.dataSource.filter(movement => movement.type === 'transfer');
      
      this.calcularDespesas();
      this.calcularReceitas();
    });
  }

  calcularDespesas() {
    this.expense = this.despesa
      .reduce((total, movement) => total + movement.amount, 0);
  }

  calcularReceitas() {
    this.income = this.receita
      .reduce((total, movement) => total + movement.amount, 0);
  }


  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


}