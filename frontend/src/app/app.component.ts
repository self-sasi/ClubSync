import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from './services/theme.service';
import { Toast } from 'primeng/toast'

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule, Toast],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: []
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private themeService : ThemeService
  ) {}

  switchTheme() {
    this.themeService.toggleDarkMode()
  }
}
