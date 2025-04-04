import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models/user';
import { AuthApiService } from '../../services/auth.api.service';
import { ProfileDialogComponent } from '../../components/profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, SidebarComponent, RouterOutlet, ButtonModule, ProfileDialogComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  user : User | undefined = undefined;
  profileVisible : boolean = false;

  constructor(private _authApiService : AuthApiService, private router : Router) {}

  ngOnInit(): void {
      this._authApiService.user$.subscribe({
        next : (user : User | undefined) => {
          if (user == undefined) {
            this.router.navigateByUrl('/auth')
          }
          this.user = user;
          console.log(this.user)
        }
      })
  }

  showProfileDialog() {
    console.log("clickeed");
    this.profileVisible = true;
  }
}
