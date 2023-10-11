import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';

import { Profile } from '../Models/profile.model';
import { map, catchError, tap } from 'rxjs/operators';
import { GraphConstant } from '../Constants/graph.constant';
import { ProfileStore } from '../Stores/profile.store';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService {
  constructor(
    private httpClient: HttpClient,
    private profileStore: ProfileStore
  ) {}

  get information(): Observable<Profile> {
    const basicInformation: Observable<Profile> = this.httpClient
      .get<Profile>(GraphConstant.profileMetaDataUrl)
      .pipe(
        catchError(error => {
          console.log(error);
          return of(null);
        })
      );
    const profilePicture: Observable<Blob> = this.httpClient
      .get(GraphConstant.profilePictureUrl, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.log(error);
          return of(null);
        })
      );
    return forkJoin({ basicInformation, profilePicture })
      .pipe(
        map((values: { basicInformation: Profile; profilePicture: Blob }) => {
          if (
            values.basicInformation == null &&
            values.profilePicture == null
          ) {
            return null;
          } else {
            const profileInformation: Profile = values.basicInformation;
            profileInformation.imageUrl = values.profilePicture;
            return profileInformation;
          }
        })
      )
      .pipe(
        tap((value: Profile) => {
          if (value != null) {
            this.profileStore.add(value);
            this.profileStore.setLoading(false);
          }
        })
      );
  }

  clear(): void {
    this.profileStore.remove();
  }
}
