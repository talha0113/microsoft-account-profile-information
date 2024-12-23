import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { ProfileRepository } from '../../Repositories/profile.repository';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  standalone: false,
})
export class ProfileComponent implements OnInit {
  profileInformation$: Observable<Profile>;
  isLoading$: Observable<boolean>;

  constructor(
    private profileService: ProfileService,
    private repository: ProfileRepository
  ) {}

  ngOnInit() {
    this.profileService.information$.subscribe();

    this.isLoading$ = this.repository.data$.pipe(
      map(value => {
        return value.isLoading;
      })
    );
    this.profileInformation$ = this.repository.data$.pipe(
      map(value => {
        return value.data;
      })
    );
  }
}
