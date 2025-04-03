import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../services/auth.api.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  isSidebarVisible = true;
  user : User | undefined = undefined;

  constructor(private _authApiService : AuthApiService, private router : Router) {}

  ngOnInit(): void {
      this._authApiService.user$.subscribe({
        next : (user : User | undefined) => {
          if (user == undefined) {
            this.router.navigateByUrl('/auth')
          }
          this.user = user
        }
      })
  }

  toggleSidebar(isVisible: boolean) {
    this.isSidebarVisible = isVisible;
  }

  test() {
    console.log(this.user)
  }

}
