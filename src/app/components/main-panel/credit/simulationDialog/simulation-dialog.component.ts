import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CreditSimulationModel } from '../../../../models/movement-model.model';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';

export type SimulationDialogResult = 'accept' | 'continue';

export interface SimulationDialogData {
id: any;
createdAt: any;
projectionType: any;
requestedMonths: any;
averageIncome: string|number;
maxAllowedMonths: any;
maxParcelValue: string|number;
maxAllowedAmount: string|number;
installmentFixed: string|number;
installmentFirst: string|number;
totalInterest: string|number;
totalPaid: string|number;
  requestedAmount: number;
  months: number;
  monthlyRate: number; 
  priceInstallment: number;
  priceTotal: number;
  sacFirstInstallment: number;
  sacTotal: number;
}

@Component({
  selector: 'app-simulation-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    CommonModule
  ],
  templateUrl: './simulation-dialog.component.html',
  styleUrl: './simulation-dialog.component.scss'
})
export class SimulationDialogComponent {
  dataSource: CreditSimulationModel[] = [];

  constructor(
    private dialogRef: MatDialogRef<SimulationDialogComponent, SimulationDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: SimulationDialogData
  ) {}

  continue(): void {
    this.dialogRef.close('continue');
  }
}
