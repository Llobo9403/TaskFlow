import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';


export interface PeriodicElement {
  Data: string;
  Descricao: string;
  Valor: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Data: "1", Descricao: 'Pagamento Débito', Valor: 1.0079},
  {Data: "2", Descricao: 'Pagamento Crédito', Valor: 4.0026},
  {Data: "3", Descricao: 'Transferência', Valor: 6.941},
  {Data: "4", Descricao: 'Pagamento Crédito', Valor: 9.012},
  {Data: "5", Descricao: 'Pagamento Débito', Valor: 10.811},
  {Data: "6", Descricao: 'Transferência', Valor: 12.0107},
  {Data: "7", Descricao: 'Pagamento Débito', Valor: 14.0067},
  {Data: "8", Descricao: 'Pagamento Fatura (Cartão de Crédito)', Valor: 15.9994},
  {Data: "9", Descricao: 'Transferência', Valor: 18.9984},
  {Data: "10", Descricao: 'Pagamento Débito', Valor: 20.1797},
];

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatCardModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  username = 'CaixaVerso';
  balanceValue: number = 1250.00;
  balance: string = `R$ ${this.balanceValue.toFixed(2)}`; 
  displayedColumns: string[] = ['Data', 'Descricao', 'Valor'];
  dataSource = ELEMENT_DATA;
}