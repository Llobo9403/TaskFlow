import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitleGroup, MatCardTitle, MatCardSubtitle } from "@angular/material/card";

@Component({
  selector: 'app-transfer',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitleGroup, MatCardTitle, MatCardSubtitle],
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  income: number = 0;
  balanceValue: number = 0;
  expense: number = 0;

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
