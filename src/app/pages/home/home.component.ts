import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { MainPanelComponent } from "../../components/main-panel/main-panel.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SideBarComponent, MainPanelComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor() {
  }
}
