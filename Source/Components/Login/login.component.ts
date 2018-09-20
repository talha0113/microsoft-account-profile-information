import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../Services/authentication.service';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    isInProgress: boolean = false;

    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    ngOnInit() {
    }

    login(): void {
        this.isInProgress = true;
        this.authenticationService.login().pipe(
            switchMap(() => {
                return from(this.router.navigateByUrl('/status'));
            }),
            tap(() => {
                this.isInProgress = false;
            }), catchError((error, caught: Observable<boolean>) => {
                this.isInProgress = false;
                return null;
            })).subscribe();
    }

}
