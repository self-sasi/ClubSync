import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { AutoComplete } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { University } from '../../models/University';

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

  router = inject(Router);

  @Input() universities: University[] = [];

  filteredUniversities: University[] = [];

  signup: boolean = false;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  selectedUniversity: University | null = null;

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
}
