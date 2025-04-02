import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard } from './middleware/auth.guard';

export const routes: Routes = [
  {
    path : '',
    component : HomeComponent,
    canActivate : [authGuard]
  },
  {
    path : 'auth',
    component : AuthComponent
  }
];
