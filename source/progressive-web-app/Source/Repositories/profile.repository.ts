import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import {
  initializeAsPending,
  joinRequestResult,
  updateRequestStatus,
  withRequestsStatus,
} from '@ngneat/elf-requests';
import {
  persistState,
  sessionStorageStrategy,
} from '@ngneat/elf-persist-state';
import { stateHistory } from '@ngneat/elf-state-history';

import { Profile } from '../Models/profile.model';

const STORE_NAME = 'PROFILE';
interface ProfileProps {
  profile: Profile | null;
}

const store = createStore(
  {
    name: STORE_NAME,
  },
  //withEntities<Profile, 'id'>({initialValue: []})
  withProps<ProfileProps>({ profile: null }),
  withRequestsStatus(initializeAsPending(STORE_NAME))
);

persistState(store, {
  key: `${STORE_NAME}.STORAGE`,
  storage: sessionStorageStrategy,
});

stateHistory(store, { maxAge: 10000 });

@Injectable()
export class ProfileRepository {
  public data$ = store.pipe(
    select((profileProps: ProfileProps) => {
      return profileProps.profile;
    }),
    joinRequestResult([STORE_NAME])
  );

  public get storeName() {
    return STORE_NAME;
  }

  public set update(profile: Profile) {
    store.update(
      state => ({
        ...state,
        profile: profile,
      }),
      updateRequestStatus(STORE_NAME, 'success')
    );
  }

  public remove() {
    store.reset();
  }
}
