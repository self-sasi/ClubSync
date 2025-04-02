import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { University } from '../../models/University';

@Component({
  selector: 'app-auth-form',
  imports: [ButtonModule, InputTextModule, FormsModule, FloatLabel, DividerModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {

  router = inject(Router);

  @Input() universities : University[] = [];

  signup : boolean = false;

  email : string = '';
  username : string = '';
  password : string = '';

  switchToSignup() {
    this.signup = true;
  }

  switchToLogin() {
    this.signup = false;
  }

  route() {
    this.router.navigateByUrl('/')
  }
}
