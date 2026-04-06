import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  username = 'Admin';

  constructor(private authService: AuthService) {}

  logout(): void {
  this.authService.logout();
  }

  viewProfile(): void {
    console.log('Visualizar perfil do usuário');
  }
}
