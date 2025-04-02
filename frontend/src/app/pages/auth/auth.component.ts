import { Component, OnInit } from '@angular/core';
import { AuthFormComponent } from "../../components/auth-form/auth-form.component";
import { UniversityService } from '../../services/university.service';
import { University } from '../../models/University';

@Component({
  selector: 'app-auth',
  imports: [AuthFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  dark : boolean = true;
  universities : University[] = [];

  constructor(private _universityService : UniversityService) {}

  ngOnInit(): void {
    this._universityService.fetchUniversities();
    this._universityService.universities$.subscribe((universities) => this.universities = universities);
  }
}
