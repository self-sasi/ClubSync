import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PanelMenu } from 'primeng/panelmenu';
import { ClubApiService } from '../../services/club.api.service';
import { Club } from '../../models/club';

@Component({
  selector: 'app-panel-menu',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.css'
})
export class PanelMenuComponent {

  private _router = inject(Router);
  private _clubApiService = inject(ClubApiService);

  clubList = signal<any[]>([]);

  items = computed(() => [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => this._router.navigateByUrl('/')
    },
    {
      label: 'Explore',
      icon: 'pi pi-plus',
      command: () => this._router.navigateByUrl('/explore')
    },
    {
      label: 'Clubs',
      icon: 'pi pi-graduation-cap',
      items: this.clubList()
    },
    {
      label: 'Events',
      icon: 'pi pi-th-large',
      items: [
        {
          label: 'All',
          icon: 'pi pi-list',
          command: () => this._router.navigateByUrl('/events')
        },
        {
          label: 'Attending',
          icon: 'pi pi-list-check',
          command: () => this._router.navigateByUrl('/events')
        },
        {
          label: 'Calendar',
          icon: 'pi pi-calendar',
          command: () => this._router.navigateByUrl('/events')
        }
      ]
    },
    {
      label: 'Inbox',
      icon: 'pi pi-inbox',
      command: () => this._router.navigateByUrl('/inbox')
    }
  ]);

  constructor() {

    this._clubApiService.userClubs$.subscribe((userClubs: Club[] | undefined) => {
      if (userClubs) {
        const clubs = userClubs.map(club => ({
          label: club.ClubName,
          icon: 'pi pi-hashtag',
          command: () => this._router.navigateByUrl('/club')
        }));
        this.clubList.set(clubs);
      }
    });
  }
}
