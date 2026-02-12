import { Component, inject, Input } from '@angular/core';
import { Pages } from '../../constants/pages.enum';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BalanceComponent } from './balance/balance.component';
import { CreditComponent } from './credit/credit.component';
import { TransferComponent } from './transfer/transfer.component';
import { RotasService } from '../../services/rotas/rotas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-panel',
  imports: [DashboardComponent, BalanceComponent, CreditComponent, TransferComponent, CommonModule],
  templateUrl: './main-panel.component.html',
  standalone: true,
  styleUrl: './main-panel.component.scss'
})
export class MainPanelComponent {
  @Input() currentPage: Pages = Pages.DASHBOARD

  private readonly rotasService = inject(RotasService);
  

  readonly page$ = this.rotasService.page$;
  readonly Pages = Pages;


}
