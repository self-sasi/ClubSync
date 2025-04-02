import { Component, inject, Input } from '@angular/core';
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
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabel,
    DividerModule,
    AutoComplete,
    Toast
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  providers : [MessageService]
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
              private messageService: MessageService) {}

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

  showToast(severity : string, summary : string, detail : string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  registerUser() {
    if (this.selectedUniversity) {
      this.userSignup.UniversityId = this.selectedUniversity!.UniversityId;
      this.authApiService.signup(this.userSignup).subscribe({
        next : () => {
          this.userLogin.Email = this.userSignup.Email;
        },
        error: (err : Error) => {
          console.log(err);
        },
        complete : () => {
          this.showToast('success', 'User Registered!', 'Please log in to your account.');
          this.switchToLogin();
        }
      })
    }
  }
}
