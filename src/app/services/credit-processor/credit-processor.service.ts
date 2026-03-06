import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, max, Observable, tap } from 'rxjs';
import { Simulation, SimulationCreate } from '../../models/movement-model.model';

export interface Limits {
  averageIncome: number;
  maxTime: number;
  maxParcelValue: number;
  maxLoanAmount: number;
  monthlyRate: number;
}

@Injectable({
  providedIn: 'root'
})

export class CreditProcessorService {
  baseUrl = 'http://localhost:3000';

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
    account: this.http.get<any>(`${this.baseUrl}/account`),
    movements: this.http.get<any[]>(`${this.baseUrl}/movement`),
  }).pipe(
    map(({ account, movements }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);

      const hasActiveDebt = (account.activeDebt ?? 0) > 0;
      const employmentType = account.employmentType ?? 'none';

      const last3MonthsIncome = movements.filter(m => {
        const d = this.parseYmd(m.date); // 'YYYY-MM-dd'
        return m.type === 'deposit' && d >= threeMonthsAgo && d <= today;
      });

      const totalIncome = last3MonthsIncome.reduce((sum, m) => sum + Number(m.amount || 0), 0);

      const averageIncome = totalIncome / 3;

      const maxTime = this.setAllowedTime(averageIncome, hasActiveDebt, employmentType);
      const maxParcelValue = Number(this.setMaxParcelValue(averageIncome, hasActiveDebt, employmentType).toFixed(2));
      const maxLoanAmount = Number((maxParcelValue * maxTime).toFixed(2));

      const monthlyRate = this.estimateRate(averageIncome, hasActiveDebt, employmentType);

      return { averageIncome, maxTime, maxParcelValue, maxLoanAmount, monthlyRate };
    })
  )}

  private estimateRate(avg: number, activeDebt: boolean, employmentType: string) {
    if (activeDebt) return 0.04;
    if (employmentType !== 'none') return 0.02;
    return 0.03;
  }

  setMaxParcelValue(averageIncome: number, activeDebt: boolean, employmentType: string) {
    if (activeDebt) return averageIncome * 0.1;
    if (employmentType !== 'none') return averageIncome * 0.2;
    return 0;
  }

  setAllowedTime(averageIncome: number, activeDebt: boolean, employmentType: string){
    if (employmentType === 'none') return 12;
    if (activeDebt) return 12;
    if (averageIncome < 1500) return 18;
    if (averageIncome >= 1500 && averageIncome < 3000) return 24;
    if (averageIncome >= 3000 && averageIncome < 6000) return 36;
    if (averageIncome >= 6000 && averageIncome < 10000) return 48;
    return 72;
  }
  
  createSimulation(payload: SimulationCreate): Observable<Simulation> {
    return this.http.post<Simulation>(`${this.baseUrl}/simulations`, payload);
  }

  private parseYmd(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  deleteSimulation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/simulations/${id}`); 
  }
}
