import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClubApiService } from '../../services/club.api.service';

@Component({
  selector: 'app-create-club-dialog',
  standalone: true,
  templateUrl: './create-club-dialog.component.html',
  styleUrls: ['./create-club-dialog.component.css'],
  imports: [CommonModule, FormsModule, Dialog, InputTextModule, InputTextarea, ButtonModule]
})
export class CreateClubDialogComponent {
  visible = true;

  clubObj = {
    clubName : '',
    description : ''
  }

  constructor(private router: Router, private _clubApiService : ClubApiService) {}

  registerClub() {
    if (!this.clubObj.clubName.trim() || !this.clubObj.description.trim()) return;

    this._clubApiService.createClub(this.clubObj)
      .subscribe({
        complete: () => {
          this.router.navigate([{ outlets: { modal: null } }]);
        }
      });
  }

  cancel() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
