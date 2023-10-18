import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import {
  createRequestsStatusOperator,
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

import { Authentication } from '../Models/authentication.model';

const STORE_NAME = 'AUTHENTICATION';
interface AuthenticationProps {
  authentication: Authentication | null;
}

const store = createStore(
  {
    name: STORE_NAME,
  },
  withProps<AuthenticationProps>({ authentication: null }),
  withRequestsStatus(initializeAsPending(STORE_NAME))
);

persistState(store, {
  key: `${STORE_NAME}.STORAGE`,
  storage: sessionStorageStrategy,
});

stateHistory(store, { maxAge: 10000 });

@Injectable()
export class AuthenticationRepository {
  public data$ = store.pipe(
    select((authenticationProps: AuthenticationProps) => {
      return authenticationProps.authentication;
    }),
    joinRequestResult([STORE_NAME])
  );

    public get data() {
        return store.getValue().authentication;
    };

  public get storeName() {
    return STORE_NAME;
  }

  public get trackRequestsStatus() {
    return createRequestsStatusOperator(store);
  }

  public set update(authentication: Authentication) {
    store.update(
      state => ({
        ...state,
        authentication: authentication,
      }),
      updateRequestStatus(STORE_NAME, 'success')
    );
  }

  public remove() {
    store.reset();
  }
}
