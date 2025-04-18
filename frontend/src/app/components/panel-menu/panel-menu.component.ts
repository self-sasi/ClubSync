import { Component } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-panel-menu',
  imports: [PanelMenu],
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.css'
})
export class PanelMenuComponent {

  items = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Explore',
      icon: 'pi pi-plus'
    },
    {
        label: 'Clubs',
        icon: 'pi pi-graduation-cap',
        items: [
            {
                label: 'Club 1',
                icon: 'pi pi-hashtag',
            },
            {
                label: 'Club 2',
                icon: 'pi pi-hashtag',
            },
            {
                label: 'Club 3',
                icon: 'pi pi-hashtag',
            }
        ]
    },
    {
      label : 'Events',
      icon: 'pi pi-th-large',
      items: [
        {
          label : 'All',
          icon : 'pi pi-list'
        },
        {
          label : 'Attending',
          icon : 'pi pi-list-check'
        },
        {
          label : 'Calendar',
          icon : 'pi pi-calendar'
        }
      ]
    },
    {
      label : 'Inbox',
      icon: 'pi pi-inbox'
    }
];
}
