import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  username = 'Admin';

  constructor(private authService: AuthService) {}

  logout(): void {
  this.authService.logout();
  }
}
