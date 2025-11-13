import { Component, OnInit, inject } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Observable, map } from 'rxjs';

import { NavigationLink } from '../../Models/navigation-link.model';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  private repository = inject(AuthenticationRepository);
  private router = inject(Router);

  public navigationLinks: Array<NavigationLink> = new Array<NavigationLink>();
  public isAuthenticated$: Observable<boolean>;

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthenticated$ = this.repository.data$.pipe(
          map(value => {
            return value.data === null ? false : true;
          })
        );
      }
    });

    this.navigationLinks.push(
      new NavigationLink(1, 'NAVIGATION.STATUS', '/status')
    );
    this.navigationLinks.push(
      new NavigationLink(2, 'NAVIGATION.PROFILE', '/profile')
    );
    this.navigationLinks.push(
      new NavigationLink(3, 'NAVIGATION.LOGOUT', '/logout')
    );
  }
}
