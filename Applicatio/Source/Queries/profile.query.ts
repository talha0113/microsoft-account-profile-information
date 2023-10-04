import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Profile } from '../Models/profile.model';
import { ProfileState } from '../States/profile.state';
import { ProfileStore } from '../Stores/profile.store';


@Injectable()
export class ProfileQuery extends QueryEntity<ProfileState, Profile> {
    constructor(protected store: ProfileStore) {
        super(store);
    }
}