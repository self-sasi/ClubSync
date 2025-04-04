import { Component, OnInit } from '@angular/core';
import { AuthFormComponent } from "../../components/auth-form/auth-form.component";
import { UniversityApiService } from '../../services/university.api.service';
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

  constructor(private _UniversityApiService : UniversityApiService) {}

  ngOnInit(): void {
    this._UniversityApiService.fetchUniversities();
    this._UniversityApiService.universities$.subscribe((universities) => this.universities = universities);
  }
}
