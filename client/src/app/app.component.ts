import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Crypto mail';
}
