import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';

import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { SafeUrlPipe } from '../../Pipes/safe-url.pipe';

@Component({
  selector: 'profile',
  imports: [AsyncPipe, SafeUrlPipe],
  templateUrl: './profile.component.html',
  standalone: true,
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly repository = inject(ProfileRepository);

  profileInformation$: Observable<Profile>;
  isLoading$: Observable<boolean>;

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
