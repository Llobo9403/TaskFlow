import { Component, inject, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-panel',
  imports: [ RouterOutlet ],
  templateUrl: './main-panel.component.html',
  standalone: true,
  styleUrl: './main-panel.component.scss'
})
export class MainPanelComponent {


}
