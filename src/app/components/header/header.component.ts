import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
   private translate = inject(TranslateService);
  username = 'Admin';
  currentLang = 'pt-BR';

  constructor(private authService: AuthService) {
    const savedLang = localStorage.getItem('app-lang') || 'pt-BR';
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  logout(): void {
  this.authService.logout();
  }

  viewProfile(): void {
    console.log('Visualizar perfil do usuário');
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('app-lang', lang);
  }
}
