import { Component, inject, OnInit } from '@angular/core';
import { ClubApiService } from '../../services/club.api.service';
import { Club } from '../../models/club';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-explore',
  imports: [ButtonModule, DividerModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {

  clubs : Club[] | undefined = [];
  private _clubApiService = inject(ClubApiService);
  private _toastService = inject(ToastService);

  ngOnInit(): void {
    this._clubApiService.clubs$.subscribe((clubs) => this.clubs = clubs);
  }

  joinSelectedClub(clubId : number) {
    this._clubApiService.joinClub(clubId).subscribe({
      next : (res) => this._toastService.showToast('success', 'Successful Registration', 'You have now joined the club!'),
      error : (err : Error) => this._toastService.showToast('error', 'Unsuccessful Registration', err.message)
    });
  }

  leaveSelectedClub(clubId : number) {
    this._clubApiService.leaveClub(clubId).subscribe({
      next : (res) => this._toastService.showToast('warn', 'Club Membership Cancelled', 'You have now left the club!'),
      error : (err : Error) => this._toastService.showToast('error', 'Unsuccessful Request', err.message)
    });
  }

  test() {
    console.log(this.clubs)
  }
}
