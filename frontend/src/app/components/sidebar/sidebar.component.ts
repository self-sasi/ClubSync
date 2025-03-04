import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule, DividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  clubList : any[] = [
    {
      name : "Club-1"
    },
    {
      name : "Club-2"
    },
    {
      name : "Club-3"
    },
    {
      name : "Club-4"
    },
  ]
}
