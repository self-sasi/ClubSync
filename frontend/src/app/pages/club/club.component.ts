import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubApiService } from '../../services/club.api.service';
import { ToastService } from '../../services/toast.service';
import { Club } from '../../models/club';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-club',
  imports: [TabsModule, CommonModule, DividerModule, ButtonModule, TableModule, SelectButton, FormsModule],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnInit {

  club: Club | undefined;
  clubId!: number;
  clubMembers : any;

  selectedSize: "small" | "large" | undefined = "small";
  selectedMemberRole = 'normal';
  memberViewOptions = [
    { label: 'Normal Members', value: 'normal' },
    { label: 'Admins', value: 'admin' }
  ];

  sizes = [
    { name: 'Small', value: 'small' },
    { name: 'Normal', value: undefined },
    { name: 'Large', value: 'large' }
]

  constructor(
    private route: ActivatedRoute,
    private clubApiService: ClubApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clubId = parseInt(params.get('clubId')!, 10);
      this.loadClubInformation();
    });
  }

  loadClubInformation(): void {

    this.clubApiService.getClub(this.clubId).subscribe({
      next: (club: Club) => {
        this.club = club;
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastService.showToast('warn', 'Access Denied', 'You are not a member of this club.');
          this.router.navigate(['/explore']);
        } else {
          this.toastService.showToast('error', 'Error', 'Could not fetch club info.');
        }
      }
    });

    this.clubApiService.getClubMembers(this.clubId).subscribe({
      next : (members) => this.clubMembers = members,
      error : (err : Error) => this.toastService.showToast('error', 'Error', err.message)
    });
  }

  test() {
    console.log(this.clubMembers)
  }

  getDisplayedMembers() {
    if (!this.clubMembers) return [];
    return this.clubMembers[this.selectedMemberRole] || [];
  }

  removeMember(memberId : number) {
    this.clubApiService.removeMember(memberId, this.clubId).subscribe({
      complete : () => this.loadClubInformation()
    });
  }

  promoteMember(memberId : number) {
    this.clubApiService.promoteToAdmin(memberId, this.clubId).subscribe({
      complete : () => this.loadClubInformation()
    });
  }
}
