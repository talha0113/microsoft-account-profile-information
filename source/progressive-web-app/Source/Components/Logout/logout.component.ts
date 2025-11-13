import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

import { AuthenticationService } from 'Source/Services/authentication.service';
import { ProfileService } from '../../Services/profile.service';

@Component({
  selector: 'logout',
  imports: [TranslocoPipe],
  templateUrl: './logout.component.html',
  standalone: true,
})
export class LogoutComponent implements OnInit {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  isOffline: boolean = true;

  ngOnInit() {
    this.isOffline = !navigator.onLine;
  }

  logout(): void {
    this.authenticationService.logout();
    this.profileService.clear();
    this.router.navigateByUrl('/login');
  }
}
