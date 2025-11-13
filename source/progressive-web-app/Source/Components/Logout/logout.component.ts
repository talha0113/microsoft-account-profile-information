import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../Services/authentication.service';
import { ProfileService } from '../../Services/profile.service';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

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
