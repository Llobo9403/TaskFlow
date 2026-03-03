import { Injectable } from '@angular/core';

export interface SimulationResult {
  installment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  installment: number;
  interest: number;
  amortization: number;
  balance: number;
}


@Injectable({
  providedIn: 'root'
})
export class AmortizationService {

  constructor() { }

calculatePrice(
    principal: number,
    monthlyRate: number,
    months: number
  ): SimulationResult {

    const rate = monthlyRate;
    const installment =
      principal * (rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    let balance = principal;
    const schedule: AmortizationRow[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= months; i++) {
      const interest = balance * rate;
      const amortization = installment - interest;
      balance -= amortization;
      totalInterest += interest;

      schedule.push({
        month: i,
        installment,
        interest,
        amortization,
        balance: Math.max(balance, 0)
      });
    }

    return {
      installment,
      totalPaid: installment * months,
      totalInterest,
      schedule
    };
  }

  calculateSAC(
    principal: number,
    monthlyRate: number,
    months: number
  ): SimulationResult {

    const amortization = principal / months;
    let balance = principal;
    const schedule: AmortizationRow[] = [];
    let totalPaid = 0;
    let totalInterest = 0;

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const installment = amortization + interest;
      balance -= amortization;

      totalPaid += installment;
      totalInterest += interest;

      schedule.push({
        month: i,
        installment,
        interest,
        amortization,
        balance: Math.max(balance, 0)
      });
    }

    return {
      installment: schedule[0].installment,
      totalPaid,
      totalInterest,
      schedule
    };
}}
