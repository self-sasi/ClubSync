import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { AutoComplete } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { University } from '../../models/University';
import { AuthApiService } from '../../services/auth.api.service';
import { UserSignup } from '../../models/user.signup';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabel,
    DividerModule,
    AutoComplete
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {


  @Input() universities: University[] = [];
  filteredUniversities: University[] = [];

  signup: boolean = false;

  protected userSignup : UserSignup = {
    FirstName : '',
    LastName : '',
    Email : '',
    Password : '',
    Location : null,
    UniversityId : 0
  }

  protected userLogin = {
    Email : '',
    Password : ''
  }

  selectedUniversity: University | null = null;

  constructor(private router : Router,
              private authApiService : AuthApiService,
              private toastService : ToastService) {}

  switchToSignup() {
    this.signup = true;
  }

  switchToLogin() {
    this.signup = false;
  }

  route() {
    this.router.navigateByUrl('/');
  }

  filterItems(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.filteredUniversities = this.universities.filter(u =>
      u.UniversityName.toLowerCase().includes(query)
    );
  }

  registerUser() {
    if (this.selectedUniversity) {
      this.userSignup.UniversityId = this.selectedUniversity!.UniversityId;
      this.authApiService.signup(this.userSignup).subscribe({
        next : () => {
          this.userLogin.Email = this.userSignup.Email;
        },
        error : (err : Error) => this.toastService.showToast('error', 'Error while logging you in', err.message),
        complete : () => {
          this.toastService.showToast('success', 'User Registered!', 'Please log in to your account.');
          this.switchToLogin();
        }
      })
    }
  }

  loginUser() {
    this.authApiService.login(this.userLogin).subscribe({
      next : () => this.router.navigateByUrl('/'),
      error : (err : Error) => this.toastService.showToast('error', 'Error while logging you in', err.message)
    });
  }
}
