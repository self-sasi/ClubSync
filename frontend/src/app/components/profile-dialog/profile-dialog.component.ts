import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { UniversityApiService } from '../../services/university.api.service';
import { AuthApiService } from '../../services/auth.api.service';
import { User } from '../../models/user';
import { University } from '../../models/University';
import { ToastService } from '../../services/toast.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-profile-dialog',
  imports: [Dialog, DividerModule, DividerModule, ButtonModule],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css'
})
export class ProfileDialogComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  user : User | undefined = undefined;
  userUniversity : University | undefined = undefined;

  constructor(private universityApiService : UniversityApiService,
              private authApiService : AuthApiService,
              private toastService : ToastService) {}

  ngOnInit(): void {
      this.authApiService.user$.subscribe({
        next : (user : User | undefined) => {
          if (user != undefined) {
            this.user = user;
            this.setUniversity(user.UniversityId);
          };
        },
        error : (err : Error) => this.toastService.showToast('error', 'Error while fetching profile', err.message),
      })
  }

  setUniversity(universityId : number) : void {
    this.universityApiService.universities$
      .pipe(
        map(universities => universities.find(u => u.UniversityId === universityId))
      )
      .subscribe(
        (university) => this.userUniversity = university
      );
  }

  test() {
    console.log(this.user);
    console.log(this.userUniversity);
  }
}
