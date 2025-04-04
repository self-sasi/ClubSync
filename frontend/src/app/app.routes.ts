import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './views/auth/auth.component';
import { authGuard } from './middleware/auth.guard';
import { LayoutComponent } from './views/layout/layout.component';

export const routes: Routes = [
  {
    path : '',
    component : LayoutComponent,
    canActivate : [authGuard]
  },
  {
    path : 'auth',
    component : AuthComponent
  }
];
