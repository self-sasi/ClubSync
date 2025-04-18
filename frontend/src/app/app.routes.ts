import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './views/auth/auth.component';
import { authGuard } from './middleware/auth.guard';
import { LayoutComponent } from './views/layout/layout.component';
import { ClubComponent } from './pages/club/club.component';
import { EventsComponent } from './pages/events/events.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { ExploreComponent } from './pages/explore/explore.component';

export const routes: Routes = [
  {
    path : '',
    component : LayoutComponent,
    canActivate : [authGuard],
    children : [
      {
        path : '',
        component : HomeComponent
      },
      {
        path : 'explore',
        component : ExploreComponent
      },
      {
        path : 'club',
        component : ClubComponent
      },
      {
        path : 'events',
        component : EventsComponent
      },
      {
        path : 'inbox',
        component : InboxComponent
      }
    ]
  },
  {
    path : 'auth',
    component : AuthComponent
  }
];
