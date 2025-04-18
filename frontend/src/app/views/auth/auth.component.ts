import { Component, OnInit } from '@angular/core';
import { AuthFormComponent } from "../../components/auth-form/auth-form.component";
import { UniversityApiService } from '../../services/university.api.service';
import { University } from '../../models/University';
import { AuthApiService } from '../../services/auth.api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [AuthFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  dark : boolean = true;
  universities : University[] = [];

  constructor(private universityApiService : UniversityApiService,
              private authApiService : AuthApiService,
              private router : Router) {}

  ngOnInit(): void {
    this.universityApiService.fetchUniversities();
    this.universityApiService.universities$.subscribe((universities) => this.universities = universities);
  }

  // this is depricated as I have moved the logic to authApiService, when the service is instantiated it already attempts to fetch the token and if the token is present, makes an api call to the backend and sets the return value as the next state of the user behaviour subject which is then captured by other components through direct subscription
  attemptTokenLogin(token : string | null) {
    if (token == null) return;
    this.authApiService.validateToken(token).subscribe({
      next : () => this.router.navigateByUrl('')
    });
  }
}
