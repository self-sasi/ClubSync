import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthApiService } from '../../services/auth.api.service';
import { DividerModule } from 'primeng/divider';
import { ClubApiService } from '../../services/club.api.service';
import { Club } from '../../models/club';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [DividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  userName : string | undefined;
  userClubs : Club[] | undefined;

  private _authApiService = inject(AuthApiService);
  private _clubApiService = inject(ClubApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this._authApiService.user$.subscribe((user) => this.userName = user?.FirstName);
    this._clubApiService.userClubs$.subscribe((clubs) => this.userClubs = clubs);
  }

  routeTo(clubId : number) {
    this.router.navigateByUrl(`/club/${clubId}`)
  }

}
