import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BankService } from '../../../services/bank/bank.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TransactionTypePipeTsPipe } from "../../../shared/pipes/transaction-type/transaction-type.pipe.ts.pipe";
import { BrlFormatPipe } from '../../../shared/pipes/brl/brl-format.pipe';
import { Movement } from '../../../models/movement-model.model';
import { DatePipe } from '@angular/common';
import { Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const map: Record<string, string> = {
  'deposit': 'Depósito',
  'transfer': 'Transferência',
}

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatCardModule, FormsModule, TransactionTypePipeTsPipe, BrlFormatPipe, DatePipe, TranslatePipe],
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
  isValueVisible = signal(true);
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

  toggleValueVisibility(): void {
    this.isValueVisible.update(value => !value);
  }
}