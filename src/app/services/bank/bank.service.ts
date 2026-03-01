import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreditSimulationModel, Movement } from '../../shared/models/movement-model/movement-model.model';

@Injectable({
  providedIn: 'root'
})

export class BankService {

  apiUrl = 'http://localhost:3000';

  constructor(readonly http: HttpClient) { }

  getConta(){
    return this.http.get(`${this.apiUrl}/account`);
  }

  getMovements(): Observable<Movement[]>{
    return this.http
    .get<Movement[]>(`${this.apiUrl}/movement`)
  }

  getSimulations(): Observable<CreditSimulationModel[]>{
    return this.http.get<CreditSimulationModel[]>(`${this.apiUrl}/simulations`)
  } 

  receiveMoney(amount: number, total: number) {
    this.http.post(`${this.apiUrl}/movement`, {
      type: 'deposit',
      amount: amount,
      date: new Date().toISOString()
    }).subscribe();
    this.http.patch(`${this.apiUrl}/account`, {
      balance: total
    }).subscribe();
  }

  sendMoney(amount: number, total: number) {
    this.http.post(`${this.apiUrl}/movement`, {
      type: 'withdrawal',
      amount: amount,
      date: new Date().toISOString()
    }).subscribe();
    this.http.patch(`${this.apiUrl}/account`, {
      balance: total
    }).subscribe();
  }
}
