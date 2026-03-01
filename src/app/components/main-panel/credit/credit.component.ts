import { Component, OnInit } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { CreditSimulationModel, Movement } from '../../../shared/models/movement-model/movement-model.model';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe, formatDate, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CreditProcessorService } from '../../../services/credit-processor/credit-processor.service';

@Component({
  selector: 'app-credit',
  imports: [MatTableModule, DatePipe, MatIconModule, CurrencyPipe, MatInputModule, MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  standalone: true,
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss'
})
export class CreditComponent implements OnInit{

  form!: FormGroup;
  displayedColumns: string[] = ['Data', 'Tipo', 'Montante', 'Tempo', 'Taxa', 'ValorParcela', "Acoes"];
  dataSource: CreditSimulationModel[] = [];
  tipos = [
    {value: 'SAC', viewValue: 'SAC'},
    {value: 'PRICE', viewValue: 'PRICE'}      
  ];
  prazoMaximo! : number;
  maxAllowedAmount! : number;

  constructor(
    private bankService: BankService,
    private creditProcessor: CreditProcessorService,
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
    this.creditProcessor.getAverageIncome().subscribe((limits) => {
      this.prazoMaximo = limits.maxTime;
      this.maxAllowedAmount = limits.maxLoanAmount;

      this.form.get('amount')?.setValidators([Validators.required, Validators.min(100), Validators.pattern(/^\d+([.,]\d{1,2})?$/), Validators.max(this.maxAllowedAmount)]);
      this.form.get('time')?.setValidators([Validators.required, Validators.min(1), Validators.max(this.prazoMaximo), Validators.pattern(/^\d+$/)]);

      console.log('Limite de prazo:', this.prazoMaximo);
      console.log('Limite de valor:', this.maxAllowedAmount);
    });
  }

  popularTabela(){
      this.bankService.getSimulations().subscribe((response: CreditSimulationModel[]) => {
        this.dataSource = response
        console.log(this.dataSource)
    })
  }

  setDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return this.form.get('date')?.setValue(formattedDate);
  }

  createSimulation() {
      if (this.form.valid) {
        const simulation: CreditSimulationModel = this.form.value;
        this.dataSource.push(simulation);
        this.form.reset();
        this.setDate();
      } else {
        console.log('Formulário inválido');
      }
  }

  limitDecimal(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;
        value = value.replace(/[^0-9.,]/g, '');
        const parts = value.split(/[.,]/);
        if (parts.length > 1) {
          parts[1] = parts[1].substring(0, 2); // limita a 2 casas
          value = parts[0] + ',' + parts[1];
        }
      
        input.value = value;
        this.form.get('amount')?.setValue(value, { emitEvent: false });
  }

  generateSimulation() {
   
  }

  buildPayload(): CreditSimulationModel {
    const formValue = this.form.value;
    return {
      date: formatDate(formValue.date, 'yyyy-MM-dd', 'pt-BR'),
      type: formValue.type,
      amount: Number(formValue.amount.toString().replace(',', '.')),
      time: Number(formValue.time),
      rate: Number(formValue.rate),
      parcelValue: Number(formValue.parcelValue)
    };
  }
}
