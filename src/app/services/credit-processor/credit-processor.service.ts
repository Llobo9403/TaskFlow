import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, max, Observable, tap } from 'rxjs';

type Limits = {
  averageIncome: number;
  maxTime: number;
  maxParcelValue: number;
  maxLoanAmount: number;
};


@Injectable({
  providedIn: 'root'
})

export class CreditProcessorService {
  averageIncome!: number;
  maxParcelValue!: number;
  maxTime!: number
  estimatedRate!: number;
  maxAllowedAmount!: number;
  hasActiveDebt!: boolean;
  employmentType!: string;
  maxLoanAmount!: number;

  constructor(private readonly http: HttpClient) { }

  getAccountProblems() {
    this.http.get<any>('http://localhost:3000/account')
    .subscribe((account) => {
      if (account.activeDebt > 0) {
        this.hasActiveDebt = true;
      } else {
        this.hasActiveDebt = false;
      }
      
      this.employmentType = account.employmentType;

      console.log('Status de dívida ativa:', this.hasActiveDebt);
      console.log('Tipo de emprego:', this.employmentType);
    });
  }

  getAverageIncome(): Observable<Limits> {
    return forkJoin({
    account: this.http.get<any>('http://localhost:3000/account'),
    movements: this.http.get<any[]>('http://localhost:3000/movement'),
  }).pipe(
    map(({ account, movements }) => {
      const today = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);

      const hasActiveDebt = (account.activeDebt ?? 0) > 0;
      const employmentType = account.employmentType ?? 'none';

      const last3MonthsIncome = movements.filter(m => {
        const d = new Date(m.date);
        return m.type === 'deposit' && d >= threeMonthsAgo && d <= today;
      });

      const totalIncome = last3MonthsIncome.reduce((sum, m) => sum + Number(m.amount || 0), 0);
      const averageIncome = totalIncome / 3;

      const maxTime = this.setAllowedTime(averageIncome, hasActiveDebt, employmentType);
      const maxParcelValue = Number(this.setMaxParcelValue(averageIncome, hasActiveDebt, employmentType).toFixed(2));
      const maxLoanAmount = Number(maxParcelValue * maxTime);

      return { averageIncome, maxTime, maxParcelValue, maxLoanAmount };
    }),
    tap(l => {
      this.averageIncome = l.averageIncome;
      this.maxTime = l.maxTime;
      this.maxParcelValue = l.maxParcelValue;
      this.maxLoanAmount = l.maxLoanAmount;
    })
  )}

  setMaxParcelValue(averageIncome: number, activeDebt: boolean, employmentType: string) {
    if (activeDebt) return averageIncome * 0.1;
    if (employmentType !== 'none') return averageIncome * 0.3;
    return 0;
  }

  setAllowedTime(averageIncome: number, activeDebt: boolean, employmentType: string){
    if (activeDebt) return 12;
    if (averageIncome < 1500) return 18;
    if (averageIncome >= 1500 && averageIncome < 3000) return 24;
    if (averageIncome >= 3000 && averageIncome < 6000) return 36;
    if (averageIncome >= 6000 && averageIncome < 10000) return 48;
    return 72;
  }

  setMaxLoanAmount(averageIncome?: number): number {
    if (averageIncome === undefined || averageIncome === null) {
      return 0;
    }
    return this.maxLoanAmount = Number(averageIncome * this.maxTime);
  }
  
  setParcelValue() {
    
  }


}
