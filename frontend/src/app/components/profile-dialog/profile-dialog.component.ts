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
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-profile-dialog',
  imports: [Dialog, DividerModule, DividerModule, ButtonModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css'
})
export class ProfileDialogComponent implements OnInit {

  editMode : boolean = false;
  passwordChangeMode : boolean = false;

  testVal : any;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  user : User | undefined = undefined;
  userUniversity : University | undefined = undefined;

  passwordSet = {
    old: '',
    new: ''
  };

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

  setEditMode() {
    this.editMode = true;
    this.passwordChangeMode = false;
  }

  exitEditMode() {
    this.editMode = false;
    this.passwordChangeMode = false;
  }

  setPasswordChangeMode() {
    this.passwordChangeMode = true;
    this.editMode = false;
  }

  exitPasswordChangeMode() {
    this.passwordChangeMode = false;
    this.editMode = false;
  }

  saveProfileChanges() {
    this.authApiService.updateProfile(this.user!).subscribe({
      next : () => this.toastService.showToast("success", "Successful", "Profile details were updated"),
      error : (err : Error) => this.toastService.showToast("error", "Error while updating Profile", err.message),
      complete : () => this.exitEditMode()
    })
  }

  submitPasswordChange() {
    if (!this.user) {
      this.toastService.showToast('error', 'User Not Found', 'Please login again.');
      return;
    }

    const payload = {
      old: this.passwordSet.old.trim(),
      new: this.passwordSet.new.trim()
    };

    if (!payload.old || !payload.new) {
      this.toastService.showToast('warn', 'Missing Fields', 'Both fields are required.');
      return;
    }

    this.authApiService.changePassword(payload).subscribe({
      complete: () => {
        this.exitPasswordChangeMode();
        this.passwordSet = { old: '', new: '' };
      }
    });
  }

}
