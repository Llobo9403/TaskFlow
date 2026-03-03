import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { Pages } from '../../constants/pages.enum';
import { RotasService } from '../../services/rotas/rotas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  @Output() redirectToPageEmmiter = new EventEmitter<Pages>();
  readonly rotasService = inject(RotasService);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      page: Pages.DASHBOARD,
      selected: true
    },
    {
      label: 'Extrato',
      page: Pages.EXTRACT,
      selected: false
    },
    {
      label: 'Transações',
      page: Pages.TRANSFER,
      selected: false
    },
    {
      label: 'Crédito',
      page: Pages.CREDIT,
      selected: false
    }
  ];

  readonly page$ = this.rotasService.page$;

  redirect(item: Pages): void {
   this.rotasService.setPage(item);
  }
}
