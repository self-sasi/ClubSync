import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { University } from '../models/University';

@Injectable({
  providedIn: 'root'
})
export class UniversityApiService {

  private _universities = new BehaviorSubject<University[]>([]);
  public universities$ = this._universities.asObservable();

  constructor(private http : HttpClient) { }

  fetchUniversities() : any {
    this.http.get<University[]>('http://localhost:3000/api/uni')
      .pipe(
        tap(response => this._universities.next(response))
      )
      .subscribe();
  }
}
