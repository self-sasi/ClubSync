import { Component, inject, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AuthApiService } from '../../services/auth.api.service';
import { PanelMenuComponent } from '../panel-menu/panel-menu.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports : [DividerModule, ButtonModule, PanelMenuComponent]
})
export class SidebarComponent {

  private authApiService = inject(AuthApiService);

  logout() {
    this.authApiService.logout();
  }

}
