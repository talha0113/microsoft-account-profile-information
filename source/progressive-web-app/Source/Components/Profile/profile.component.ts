import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { ProfileQuery } from '../../Queries/profile.query';
import { map } from 'rxjs/operators';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileInformation$: Observable<Profile>;
  isLoading$: Observable<boolean>;

  constructor(
    private profileService: ProfileService,
    private profileQuery: ProfileQuery
  ) {}

  ngOnInit() {
    if (this.profileQuery.getCount() === 0) {
      this.profileService.information.subscribe();
    }

    this.isLoading$ = this.profileQuery.selectLoading();
    this.profileInformation$ = this.profileQuery.selectAll().pipe(
      map((value: Profile[]) => {
        if (value.length > 0) {
          return value[0];
        } else {
          return null;
        }
      })
    );
  }
}
