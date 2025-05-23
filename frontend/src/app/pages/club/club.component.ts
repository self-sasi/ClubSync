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
import { EventsApiService } from '../../services/events.api.service';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AnnouncementsComponent } from "../../components/announcements/announcements.component";
import { AnnouncementsApiService } from '../../services/announcements.api.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-club',
  imports: [TabsModule, CommonModule, DividerModule, ButtonModule, TableModule, SelectButton, FormsModule, Dialog, InputTextModule, SelectButtonModule, AnnouncementsComponent, DropdownModule, MultiSelectModule],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnInit {

  club: Club | undefined;
  clubId!: number;
  clubMembers : any;
  clubEvents : any;

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

  showCreateEventDialog = false;
  newEvent = {
    Name: '',
    EventDate: '',
    Location: '',
    ManagerIds: [] as number[]
  };


  showCreateAnnouncementDialog = false;
  selectedEventId: number | null = null;
  newAnnouncementContent: string = '';

  showEditClubDialog = false;
  editClubData = {
    ClubName: '',
    Description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private clubApiService: ClubApiService,
    private toastService: ToastService,
    private router: Router,
    private eventsApiService : EventsApiService,
    private announcementsApiService : AnnouncementsApiService
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

    this.eventsApiService.getClubEvents(this.clubId).subscribe({
      next : (events) => this.clubEvents = events,
      error : (err : Error) => this.toastService.showToast('error', 'Error', err.message)
    })
  }

  test() {
    console.log(this.clubEvents)
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

  openEventDialog(eventId: number) {
    this.router.navigate([{ outlets: { modal: ['event', eventId] } }]);
  }

  createEvent() {
    if (!this.newEvent.Name.trim() || !this.newEvent.EventDate || !this.newEvent.Location.trim()) return;

    this.eventsApiService.createEvent({
      clubId: this.clubId,
      name: this.newEvent.Name.trim(),
      eventDate: this.newEvent.EventDate,
      location: this.newEvent.Location.trim(),
      managerIds: this.newEvent.ManagerIds
    }).subscribe({
      complete: () => {
        this.showCreateEventDialog = false;
        this.loadClubInformation();
        this.newEvent = {
          Name: '',
          EventDate: '',
          Location: '',
          ManagerIds: []
        };
      }
    });
  }

  postAnnouncement() {
    if (!this.clubId || !this.selectedEventId || !this.newAnnouncementContent.trim()) return;

    this.announcementsApiService.createAnnouncement({
      clubId: this.clubId,
      eventId: this.selectedEventId,
      content: this.newAnnouncementContent.trim()
    }).subscribe({
      complete: () => {
        this.resetAnnouncementForm();
        this.showCreateAnnouncementDialog = false;
      }
    });
  }

  resetAnnouncementForm() {
    this.selectedEventId = null;
    this.newAnnouncementContent = '';
  }

  leaveClub() {
    this.clubApiService.leaveClub(this.clubId).subscribe({
      complete : () => {
        this.toastService.showToast('warn', 'Club left', `You have exited ${this.club?.ClubName} successfully.`);
        this.router.navigateByUrl('/explore');
      }
    })
  }

  openEditClubDialog() {
    if (!this.club) return;

    this.editClubData = {
      ClubName: this.club.ClubName,
      Description: this.club.Description
    };

    this.showEditClubDialog = true;
  }

  resetEditClubForm() {
    this.editClubData = { ClubName: '', Description: '' };
    this.showEditClubDialog = false;
  }

  submitClubEdit() {
    if (!this.club) return;

    this.clubApiService.updateClub(this.club.ClubId, {
      ClubName: this.editClubData.ClubName.trim(),
      Description: this.editClubData.Description.trim()
    }).subscribe({
      complete: () => {
        this.loadClubInformation();
        this.resetEditClubForm();
      }
    });
  }
}
