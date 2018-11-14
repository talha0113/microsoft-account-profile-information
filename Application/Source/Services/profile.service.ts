import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';

import { Profile } from '../Models/profile.model';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { GraphConstant } from '../Constants/graph.constant';
import { ProfileStore } from '../Stores/profile.store';

@Injectable()
export class ProfileService {

    constructor(private httpClient: HttpClient, private profileStore: ProfileStore) { }

    get information(): Observable<Profile> {
        let basicInformation: Observable<Profile> = this.httpClient.get<Profile>(GraphConstant.profileMetaDataUrl).pipe(catchError((error) => { return of(null); }));
        let profilePicture: Observable<Blob> = this.httpClient.get(GraphConstant.profilePictureUrl, { responseType: "blob" }).pipe(catchError((error) => { return of(null); }));
        return forkJoin<Profile, Blob>(basicInformation, profilePicture).pipe(map((values: [Profile, Blob]) => {
            if (values["0"] == null && values["1"] == null) {
                return null;
            }
            else {
                let profileInformation: Profile = values["0"];
                profileInformation.imageUrl = values["1"];
                return profileInformation;
            }
        })).pipe(tap((value: Profile) => {
            if (value != null) {
                this.profileStore.add(value);
                this.profileStore.setLoading(false);
                }
            }));
    }

    clear(): void {
        this.profileStore.remove();
    }
}