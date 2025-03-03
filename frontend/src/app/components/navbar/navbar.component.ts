import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navbar',
  imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MegaMenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          {
              label: 'Company',
              root: true,
              items: [
                  [
                      {
                          items: [
                              { label: 'Features', icon: 'pi pi-list', subtext: 'Subtext of item' },
                              { label: 'Customers', icon: 'pi pi-users', subtext: 'Subtext of item' },
                              { label: 'Case Studies', icon: 'pi pi-file', subtext: 'Subtext of item' }
                          ]
                      }
                  ],
                  [
                      {
                          items: [
                              { label: 'Solutions', icon: 'pi pi-shield', subtext: 'Subtext of item' },
                              { label: 'Faq', icon: 'pi pi-question', subtext: 'Subtext of item' },
                              { label: 'Library', icon: 'pi pi-search', subtext: 'Subtext of item' }
                          ]
                      }
                  ],
                  [
                      {
                          items: [
                              { label: 'Community', icon: 'pi pi-comments', subtext: 'Subtext of item' },
                              { label: 'Rewards', icon: 'pi pi-star', subtext: 'Subtext of item' },
                              { label: 'Investors', icon: 'pi pi-globe', subtext: 'Subtext of item' }
                          ]
                      }
                  ],
                  [
                      {
                          items: [{ image: 'https://primefaces.org/cdn/primeng/images/uikit/uikit-system.png', label: 'GET STARTED', subtext: 'Build spectacular apps in no time.' }]
                      }
                  ]
              ]
          },
          {
              label: 'Resources',
              root: true
          },
          {
              label: 'Contact',
              root: true
          }
      ];
  }
}
