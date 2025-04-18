import { Component, inject, OnInit } from '@angular/core';
import { ClubApiService } from '../../services/club.api.service';
import { Club } from '../../models/club';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-explore',
  imports: [ButtonModule, DividerModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {

  clubs : Club[] | undefined = [];
  private _clubApiService = inject(ClubApiService);

  ngOnInit(): void {
    this._clubApiService.clubs$.subscribe((clubs) => this.clubs = clubs);
  }

  test() {
    console.log(this.clubs)
  }
}
