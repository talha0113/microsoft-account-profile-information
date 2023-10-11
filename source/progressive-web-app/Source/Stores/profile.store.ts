import { Injectable } from '@angular/core';
import {
  EntityStore,
  StoreConfig,
  getInitialEntitiesState,
} from '@datorama/akita';

import { Profile } from '../Models/profile.model';
import { ProfileState } from '../States/profile.state';

const state = {
  ...getInitialEntitiesState(),
};

@Injectable()
@StoreConfig({ name: 'profile', idKey: 'id' })
export class ProfileStore extends EntityStore<ProfileState, Profile> {
  constructor() {
    super(state);
  }
}
