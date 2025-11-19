import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProfileService } from '../../Services/profile.service';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { SafeUrlPipe } from '../../Pipes/safe-url.pipe';

@Component({
  selector: 'profile',
  imports: [SafeUrlPipe],
  templateUrl: './profile.component.html',
  standalone: true,
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly repository = inject(ProfileRepository);

  profileInformation = toSignal(
    this.repository.data$.pipe(map(value => value.data))
  );

  isLoading = toSignal(
    this.repository.data$.pipe(map(value => value.isLoading)),
    { initialValue: true }
  );

  ngOnInit() {
    this.profileService.information$.subscribe();
  }
}
