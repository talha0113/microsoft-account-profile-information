import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationQuery } from '../../Queries/authentication.query';
import { AuthenticationState } from '../../States/authentication.state';


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    isInProgress: boolean = false;
    isOffline: boolean = !navigator.onLine;

    constructor(private authenticationService: AuthenticationService, private authenticationQuery: AuthenticationQuery,  private router: Router) { }

    ngOnInit() {
        this.isInProgress = this.isOffline;

        if (!this.isOffline) {
            this.authenticationQuery.select<AuthenticationState>().subscribe((value: AuthenticationState) => {
                this.isInProgress = true;
                if (value.authentication.tokenId != null && value.authentication.accessToken == null) {
                    this.authenticationService.refreshToken().subscribe(() => {
                        this.router.navigateByUrl("/status");
                    });
                }
                else {
                    this.isInProgress = false;
                }
            });
        }

        this.authenticationQuery.selectError().subscribe((error) => {
            if (error) {
                this.isInProgress = false;
            }
        });
    }

    login(): void {
        this.isInProgress = true;
        this.authenticationService.login();
    }

}
