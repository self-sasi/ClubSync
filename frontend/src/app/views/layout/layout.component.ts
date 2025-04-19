import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models/user';
import { AuthApiService } from '../../services/auth.api.service';
import { ProfileDialogComponent } from '../../components/profile-dialog/profile-dialog.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ClubApiService } from '../../services/club.api.service';
import { Club } from '../../models/club';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, SidebarComponent, RouterOutlet, ButtonModule, ProfileDialogComponent, LoaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  user : User | undefined = undefined;
  profileVisible : boolean = false;
  test = undefined

  constructor(private _authApiService : AuthApiService, private router : Router, private _clubApiService : ClubApiService) {}

  ngOnInit(): void {
    this._authApiService.user$.subscribe({
      next : (user : User | undefined) => {
        if (user) {
          this.user = user;
        }
      }
    });
  }

  showProfileDialog() {
    console.log("clickeed");
    this.profileVisible = true;
  }
}
