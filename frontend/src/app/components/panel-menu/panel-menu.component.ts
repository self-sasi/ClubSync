import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-panel-menu',
  imports: [PanelMenu],
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.css'
})
export class PanelMenuComponent {

  private _router = inject(Router);
  // todo -> make a function for routing for reusable code, i have rewritten the same line again and again

  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command : () => this._router.navigateByUrl('/')
    },
    {
      label: 'Explore',
      icon: 'pi pi-plus',
      command : () => this._router.navigateByUrl('/explore')
    },
    {
        label: 'Clubs',
        icon: 'pi pi-graduation-cap',
        items: [
            {
                label: 'Club 1',
                icon: 'pi pi-hashtag',
                command : () => this._router.navigateByUrl('/club')
            },
            {
                label: 'Club 2',
                icon: 'pi pi-hashtag',
                command : () => this._router.navigateByUrl('/club')
            },
            {
                label: 'Club 3',
                icon: 'pi pi-hashtag',
                command : () => this._router.navigateByUrl('/club')
            }
        ]
    },
    {
      label : 'Events',
      icon: 'pi pi-th-large',
      items: [
        {
          label : 'All',
          icon : 'pi pi-list',
          command : () => this._router.navigateByUrl('/events')
        },
        {
          label : 'Attending',
          icon : 'pi pi-list-check',
          command : () => this._router.navigateByUrl('/events')
        },
        {
          label : 'Calendar',
          icon : 'pi pi-calendar',
          command : () => this._router.navigateByUrl('/events')
        }
      ]
    },
    {
      label : 'Inbox',
      icon: 'pi pi-inbox',
      command : () => this._router.navigateByUrl('/inbox')
    }
];
}
