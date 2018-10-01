import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

import { NavigationLink } from '../../Models/navigation-link.model';
import { AuthenticationQuery } from '../../Queries/authentication.query';

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    public navigationLinks: Array<NavigationLink> = new Array<NavigationLink>();
    public isAuthenticated: boolean = false;
    constructor(private authenticationQuery: AuthenticationQuery, private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isAuthenticated = this.authenticationQuery.isAuthenticated();
            }
        });

        this.navigationLinks.push(new NavigationLink(1, "Status", "/status"));
        this.navigationLinks.push(new NavigationLink(2, "Profile", "/profile"));
        this.navigationLinks.push(new NavigationLink(2, "Log Out", "/logout"));
    }
}
