import { Routes } from '@angular/router';
import { DashboardComponent } from './components/main-panel/dashboard/dashboard.component';
import { CreditComponent } from './components/main-panel/credit/credit.component';
import { BalanceComponent } from './components/main-panel/balance/balance.component';
import { TransferComponent } from './components/main-panel/transfer/transfer.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { authGuard } from './auth-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainPanelComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'credit', component: CreditComponent },
      { path: 'extract', component: BalanceComponent },
      { path: 'transactions', component: TransferComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
