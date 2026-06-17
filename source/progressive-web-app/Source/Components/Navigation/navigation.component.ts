import { Component, OnInit, inject } from '@angular/core';
import { Router, Event, NavigationEnd, RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { NavigationLink } from '../../Models/navigation-link.model';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'navigation',
  imports: [RouterLink, AsyncPipe, TranslocoPipe],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
})
export class NavigationComponent implements OnInit {
  private readonly repository = inject(AuthenticationRepository);
  private readonly router = inject(Router);

  public navigationLinks: Array<NavigationLink> = new Array<NavigationLink>();
  public isAuthenticated$: Observable<boolean> = this.repository.data$.pipe(
    map(value => value.data !== null)
  );

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // TODO: Add navigation handling logic
      }
    });

    this.navigationLinks.push(
      new NavigationLink(1, 'NAVIGATION.STATUS', '/status'),
      new NavigationLink(2, 'NAVIGATION.PROFILE', '/profile'),
      new NavigationLink(3, 'NAVIGATION.LOGOUT', '/logout')
    );
  }
}
