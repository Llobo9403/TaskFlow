import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatError, MatInputModule, MatLabel } from "@angular/material/input";
import { TransferDialogResult } from '../../../../models/movement-model.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { BankService } from '../../../../services/bank/bank.service';
import { max } from 'rxjs';

@Component({
  selector: 'app-transaction-dialog',
  imports: [MatError, MatFormFieldModule, MatLabel, ReactiveFormsModule, MatDialogModule, MatInputModule, MatButtonModule, NgIf],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss'
})
export class TransactionDialogComponent implements OnInit{
  form: FormGroup
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<TransactionDialogComponent, TransferDialogResult | null>);
  data = inject(MAT_DIALOG_DATA, { optional: true }) as TransferDialogResult;
  maxAmount: number = 0;
  currentBalance = 0;
  
  constructor(private bankService: BankService) {
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      agency: [''],
      account: ['']
    })
  }

  ngOnInit(): void {
      if (this.data.type === 'transfer') {
      const agencyControl = this.form.get('agency');
      const accountControl = this.form.get('account');

      agencyControl?.setValidators([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern(/^\d{4}$/)
      ]);

      accountControl?.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d{10}$/)
      ]);

      agencyControl?.updateValueAndValidity();
      accountControl?.updateValueAndValidity();
    }

    this.getAccountDetails();
  }

  getAccountDetails() {
   this.bankService.getConta().subscribe(conta => {
      const saldo = conta?.balance ?? 0;

      this.currentBalance = saldo;
      this.maxAmount = saldo;

      if (this.data.type === 'transfer') {
        this.form.get('amount')?.setValidators([
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.currentBalance),
          Validators.pattern(/^\d+([.,]\d{1,2})?$/)
        ]);

        this.form.get('amount')?.updateValueAndValidity();
      }
    });
  }

  close() {
    this.dialogRef.close(null);
  }

  limitDecimal(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value ?? '';
    value = value.replace(/[^\d,]/g, '');
    const firstComma = value.indexOf(',');
    if (firstComma !== -1) {
      const before = value.slice(0, firstComma + 1);
      const after = value.slice(firstComma + 1).replace(/,/g, '');
      value = before + after;
    }
    const parts = value.split(',');
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      value = `${parts[0]},${parts[1]}`;
    }
    input.value = value;
    this.form.get('amount')?.setValue(value, { emitEvent: false });
  }

  limitDigits(event: Event, maxLen: number): void {
    const input = event.target as HTMLInputElement;
    let v = (input.value ?? '').replace(/\D/g, '');
    if (v.length > maxLen) v = v.slice(0, maxLen);
    input.value = v;
    const ctrlName = input.getAttribute('formControlName');
    if (ctrlName) this.form.get(ctrlName)?.setValue(v, { emitEvent: false });
  }

  limitAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value ?? '';
    value = value.replace(/[^\d,]/g, '');
    const firstComma = value.indexOf(',');
    if (firstComma !== -1) {
      const before = value.slice(0, firstComma + 1);
      const after = value.slice(firstComma + 1).replace(/,/g, '');
      value = before + after;
    }
        const parts = value.split(',');
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      value = `${parts[0]},${parts[1]}`;
    }
    const numeric = this.parseBRL(value);
    if (!Number.isNaN(numeric) && numeric > this.maxAmount) {
      value = this.formatBRL(this.maxAmount);
    }
        input.value = value;
    this.form.get('amount')?.setValue(value, { emitEvent: false });
  }

  parseBRL(v: string): number {
    if (!v) return NaN;
    return Number(v.replace(/\./g, '').replace(',', '.'));
  }

  formatBRL(n: number): string {
    return n.toFixed(2).replace('.', ',');
  }

 confirm() {
    if (this.form.invalid) return;
    const amount = this.parseBRL(this.form.value.amount);
    if (Number.isNaN(amount) || amount <= 0) return;
    if (this.data.type === 'transfer') {
      const newBalance = this.currentBalance - amount;
      this.bankService.sendMoney(amount, newBalance);
    }
    if (this.data.type === 'deposit') {
      const newBalance = this.currentBalance + amount;
      this.bankService.receiveMoney(amount, newBalance);
    }
    this.dialogRef.close(true);
  }
}