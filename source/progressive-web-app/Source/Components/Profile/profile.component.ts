import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProfileService } from '../../Services/profile.service';
import { Profile } from '../../Models/profile.model';
import { ProfileRepository } from '../../Repositories/profile.repository';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  standalone: false,
})
export class ProfileComponent implements OnInit {
  profileInformation = toSignal(
    this.repository.data$.pipe(
      map(value => value.data)
    )
  );
  
  isLoading = toSignal(
    this.repository.data$.pipe(
      map(value => value.isLoading)
    ),
    { initialValue: true }
  );

  constructor(
    private profileService: ProfileService,
    private repository: ProfileRepository
  ) {}

  ngOnInit() {
    this.profileService.information$.subscribe();
  }
}
