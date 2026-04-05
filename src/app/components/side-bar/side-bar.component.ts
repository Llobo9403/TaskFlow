import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: 'dashboard',
      exact: false
    },{
      label: 'Extrato',
      route: 'extract',
      exact: false
    },{
      label: 'Transações',
      route: 'transactions',
      exact: false
    },{
      label: 'Crédito',
      route: 'credit',
      exact: false
    }
  ]
}
