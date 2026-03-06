import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Account, CreditSimulationModel, Movement, Simulation } from '../../shared/models/movement-model/movement-model.model';

@Injectable({
  providedIn: 'root'
})

export class BankService {

  apiUrl = 'http://localhost:3000';

  constructor(readonly http: HttpClient) { }

  getConta(): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/account`);
  }

  getMovements(): Observable<Movement[]>{
    return this.http
    .get<Movement[]>(`${this.apiUrl}/movement`)
  }

  getSimulations(): Observable<Simulation[]>{
    return this.http.get<Simulation[]>(`${this.apiUrl}/simulations`)
  } 

  receiveMoney(amount: number, total: number) {
    this.http.post(`${this.apiUrl}/movement`, {
      type: 'deposit',
      amount: amount,
      decription: '', 
      date: new Date().toISOString()
    }).subscribe();
    this.http.patch(`${this.apiUrl}/account`, {
      balance: total
    }).subscribe();
  }

  sendMoney(amount: number, total: number) {
    this.http.post(`${this.apiUrl}/movement`, {
      type: 'transfer',
      amount: amount,
      description: '',
      date: new Date().toISOString()
    }).subscribe();
    this.http.patch(`${this.apiUrl}/account`, {
      balance: total
    }).subscribe();
  }
}
