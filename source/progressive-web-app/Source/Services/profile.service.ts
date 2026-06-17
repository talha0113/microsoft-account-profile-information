import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, map, catchError, tap } from 'rxjs';
import { trackRequestResult } from '@ngneat/elf-requests';

import { Profile } from '../Models/profile.model';
import { ProfileRepository } from '../Repositories/profile.repository';
import { GraphConstant } from '../Constants/graph.constant';

@Injectable()
export class ProfileService {
  private readonly httpClient = inject(HttpClient);
  private readonly repository = inject(ProfileRepository);

  get information$(): Observable<Profile | null> {
    const basicInformation: Observable<Profile | null> = this.httpClient
      .get<Profile>(GraphConstant.profileMetaDataUrl)
      .pipe(
        catchError(error => {
          console.error(error);
          return of(null);
        })
      );
    const profilePicture: Observable<Blob | null> = this.httpClient
      .get(GraphConstant.profilePictureUrl, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.error(error);
          return of(null);
        })
      );
    return forkJoin({ basicInformation, profilePicture }).pipe(
      map(
        (values: {
          basicInformation: Profile | null;
          profilePicture: Blob | null;
        }) => {
          if (values.basicInformation == null) {
            return null;
          }
          const profileInformation: Profile = values.basicInformation;
          profileInformation.imageUrl = values.profilePicture;
          return profileInformation;
        }
      ),
      tap((value: Profile | null) => {
        if (value != null) {
          this.repository.update = value;
        }
      }),
      trackRequestResult([this.repository.storeName])
    );
  }

  clear(): void {
    this.repository.remove();
  }
}
