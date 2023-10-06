import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../Services/authentication.service';
import { ProfileService } from '../../Services/profile.service';

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

    isOffline: boolean = !navigator.onLine;

    constructor(private authenticationService: AuthenticationService, private profileService: ProfileService, private router: Router) { }

    ngOnInit() {
    }

    logout(): void {
        this.authenticationService.logout();
        this.profileService.clear();
        this.router.navigateByUrl('/login');
    }

}
