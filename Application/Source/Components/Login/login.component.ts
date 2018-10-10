import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../Services/authentication.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    isInProgress: boolean = false;
    isOffline: boolean = !navigator.onLine;

    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    ngOnInit() {
        this.isInProgress = this.isOffline;
    }

    login(): void {
        this.isInProgress = true;
        this.authenticationService.login().pipe(
            tap(() => {
                this.isInProgress = false;
                this.router.navigateByUrl('/status')
            }), catchError((error, caught: Observable<boolean>) => {
                this.isInProgress = false;
                return null;
            })).subscribe();
    }

}
