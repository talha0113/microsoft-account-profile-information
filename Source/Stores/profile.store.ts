import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig, getInitialActiveState, transaction, ID } from '@datorama/akita';

import { Profile } from '../Models/profile.model';
import { ProfileState } from '../States/profile.state';

const state = {
    ...getInitialActiveState()
};

@Injectable()
@StoreConfig({ name: 'profile', idKey: 'id' })
export class ProfileStore extends EntityStore<ProfileState, Profile> {
    constructor() {
        super(state);
    }
}