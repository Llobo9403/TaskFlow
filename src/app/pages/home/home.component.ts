import { Component, inject, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { Pages } from '../../constants/pages.enum';
import { MainPanelComponent } from "../../components/main-panel/main-panel.component";
import { Subject, takeUntil } from 'rxjs';
import { RotasService } from '../../services/rotas/rotas.service';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SideBarComponent, MainPanelComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {
 private rotasService = inject(RotasService);
 currentPage: Pages = Pages.DASHBOARD;

  private destroy$ = new Subject<void>();
  constructor() {
    this.rotasService.page$.pipe(takeUntil(this.destroy$)).subscribe(page => {
      this.currentPage = page;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
