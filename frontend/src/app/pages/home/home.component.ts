import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthApiService } from '../../services/auth.api.service';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-home',
  imports: [DividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  userName : string | undefined = '';
  private _authApiService = inject(AuthApiService);

  ngOnInit(): void {
      this._authApiService.user$.subscribe((user) => this.userName = user?.FirstName);
  }
}
