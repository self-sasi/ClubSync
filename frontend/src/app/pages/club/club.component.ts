import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubApiService } from '../../services/club.api.service';
import { ToastService } from '../../services/toast.service';
import { Club } from '../../models/club';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-club',
  imports: [TabsModule, CommonModule, DividerModule],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnInit {

  club: Club | undefined;
  clubId!: number;

  constructor(
    private route: ActivatedRoute,
    private clubApiService: ClubApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clubId = parseInt(this.route.snapshot.paramMap.get('clubId')!, 10);
    this.loadClubInformation();
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
  }
}
