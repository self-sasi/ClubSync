import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './views/auth/auth.component';
import { authGuard } from './middleware/auth.guard';
import { LayoutComponent } from './views/layout/layout.component';
import { ClubComponent } from './pages/club/club.component';
import { EventsComponent } from './pages/events/events.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { CreateClubDialogComponent } from './components/create-club-dialog/create-club-dialog.component';
import { EventDialogComponent } from './components/event-dialog/event-dialog.component';
import { AllEventsComponent } from './components/all-events/all-events.component';
import { RSVPEventsComponent } from './components/rsvp-events/rsvp-events.component';

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
        path : 'club/:clubId',
        component : ClubComponent,
      },
      {
        path: 'club/create',
        component: CreateClubDialogComponent,
        outlet: 'modal'
      },
      {
        path : 'events',
        component : EventsComponent,
        children : [
          {
            path : '',
            component : AllEventsComponent
          },
          {
            path : 'rsvp',
            component : RSVPEventsComponent
          }
        ]
      },
      {
        path : 'inbox',
        component : InboxComponent
      },
      {
        path: 'event/:eventId',
        component: EventDialogComponent,
        outlet: 'modal'
      }
    ]
  },
  {
    path : 'auth',
    component : AuthComponent
  }
];
