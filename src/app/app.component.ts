import { Component } from '@angular/core';
import { HomeComponent } from "./pages/home/home.component";
import { Pages } from './constants/pages.enum';

@Component({
  selector: 'app-root',
  imports: [HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TaskFlow';
 
}
