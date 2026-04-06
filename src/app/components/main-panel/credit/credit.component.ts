import { Component, OnInit } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { ProjectionType, Simulation, SimulationCreate } from '../../../models/movement-model.model';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe, DecimalPipe, formatDate, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CreditProcessorService, Limits } from '../../../services/credit-processor/credit-processor.service';
import { AmortizationService } from '../../../services/amortization/amortization.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SimulationDialogComponent } from './simulationDialog/simulation-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-credit',
  imports: [MatTableModule, DatePipe, MatIconModule, CurrencyPipe, MatInputModule, MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, NgIf, MatDialogModule, DecimalPipe, MatMenuModule, TranslatePipe],
  standalone: true,
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss'
})
export class CreditComponent implements OnInit{

  form!: FormGroup;
  displayedColumns: string[] = ['Data', 'Tipo', 'Montante', 'Tempo', 'Taxa', 'ValorParcela', "Acoes"];
  dataSource: Simulation[] = [];
  tipos = [
    {value: 'SAC', viewValue: 'SAC'},
    {value: 'PRICE', viewValue: 'PRICE'}      
  ];
  prazoMaximo! : number;
  maxLoanAmount : number = 0;

  constructor(
    private bankService: BankService,
    private creditProcessor: CreditProcessorService,
    private amortization: AmortizationService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      date: [new Date().toISOString(), Validators.required],
      type: ['SAC', Validators.required],
      amount: [, [Validators.required, Validators.min(100), Validators.pattern(/^\d+([.,]\d{1,2})?$/)]],
      time: [12, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      rate: [0.05, [Validators.required]],
      parcelValue: [0, Validators.required]
    });
  }

  ngOnInit() {
    this.popularTabela();
    this.setDate();
    this.setLimits();
  }

  setLimits() {
   this.creditProcessor.getAverageIncome().subscribe({
    next: (limits) => {
      this.prazoMaximo = limits.maxTime;
      this.maxLoanAmount = limits.maxLoanAmount;

      const amountCtrl = this.form.get('amount');
      amountCtrl?.setValidators([
        Validators.required,
        Validators.min(100),
        Validators.max(limits.maxLoanAmount),
        Validators.pattern(/^\d+([.,]\d{1,2})?$/)
      ]);
      amountCtrl?.updateValueAndValidity();

      const timeCtrl = this.form.get('time');
      timeCtrl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(limits.maxTime),
        Validators.pattern(/^\d+$/)
      ]);
      timeCtrl?.updateValueAndValidity();

      console.log('Limites atualizados:', limits);
    },
    error: (err) => console.error('Erro ao obter limites:', err)
    });
  }

  popularTabela(){
    this.bankService.getSimulations().subscribe((response: Simulation[]) => {
      this.dataSource = response;
    });
  }

  setDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return this.form.get('date')?.setValue(formattedDate);
  }

  limitDecimal(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;
        value = value.replace(/[^0-9.,]/g, '');
        const parts = value.split(/[.,]/);
        if (parts.length > 1) {
          parts[1] = parts[1].substring(0, 2);
          value = parts[0] + ',' + parts[1];
        }
      
        input.value = value;
        this.form.get('amount')?.setValue(value, { emitEvent: false });
  }

  generateSimulation() {
    if (this.form.invalid) return;

    const type = this.form.value.type;
    const amount = Number(this.form.value.amount);
    const time = Number(this.form.value.time);

    this.creditProcessor.getAverageIncome().subscribe((limits) => {
      const rate = limits.monthlyRate;

      let parcelValue = 0;
      if (type === 'PRICE') {
        const price = this.amortization.calculatePrice(amount, rate, time);
        parcelValue = price.installment;
      } else {
        const sac = this.amortization.calculateSAC(amount, rate, time);
        parcelValue = sac.schedule[0]?.installment ?? 0;
      }

      const simulation: SimulationCreate = {
        createdAt: this.form.value.date,
        projectionType: type,
        requestedAmount: amount,
        requestedMonths: time,
        averageIncome: limits.averageIncome,
        maxAllowedMonths: limits.maxTime,
        maxParcelValue: limits.maxParcelValue,
        maxAllowedAmount: limits.maxLoanAmount,
        monthlyRate: limits.monthlyRate,
        installmentFirst: type === 'SAC' ? parcelValue : undefined,
        installmentFixed: type === 'PRICE' ? parcelValue : undefined,
        totalPaid: parcelValue * time,
        totalInterest: (parcelValue * time) - amount

      };

      this.creditProcessor.createSimulation(simulation).subscribe({
        next: (response) => {
          this.dataSource = [response, ...this.dataSource];

          this.openSimulationDialog({
            simulation: response,
            limits: limits
          });
        },
        error: (err) => console.error('Erro ao salvar simulação:', err)
      });
    });
  }

  createSimulation() {
    if (this.form.valid) {
      const simulation: Simulation = this.form.value;
      this.dataSource.push(simulation);
      this.form.reset();
      this.setDate();
    } else {
      console.log('Formulário inválido');
    }
  }

  buildPayload(limits: Limits,
  type: ProjectionType,
  amount: number,
  time: number,
  parcelValue: number): SimulationCreate {
   return {
      createdAt: this.form.value.date,
      projectionType: type,
      requestedAmount: amount,
      requestedMonths: time,
      averageIncome: limits.averageIncome,
      maxAllowedMonths: limits.maxTime,
      maxParcelValue: limits.maxParcelValue,
      maxAllowedAmount: limits.maxLoanAmount,
      monthlyRate: limits.monthlyRate,
      installmentFirst: type === 'SAC' ? parcelValue : undefined,
      installmentFixed: type === 'PRICE' ? parcelValue : undefined,
      totalPaid: parcelValue * time,
      totalInterest: (parcelValue * time) - amount
    };
  }

  openSimulationDialog(data: { simulation: Simulation, limits: Limits }) {
    this.dialog.open(SimulationDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        ...data.simulation,
        ...data.limits
      }
    });
  }

  excluirRegistro(element: Simulation) {
     if (!element?.id) return;

    this.creditProcessor.deleteSimulation(element.id).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(s => s.id !== element.id);
        console.log('Simulação excluída com sucesso');
      },
      error: (err) => console.error('Erro ao excluir simulação:', err)
    });
  }
}
