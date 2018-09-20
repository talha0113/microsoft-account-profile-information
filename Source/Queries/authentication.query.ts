import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { AuthenticationStore } from '../Stores/authentication.store';
import { Authentication } from '../Models/authentication.model';
import { AuthenticationState } from '../States/authentication.state';


@Injectable()
export class AuthenticationQuery extends QueryEntity<AuthenticationState, Authentication> {
    constructor(protected store: AuthenticationStore) {
        super(store);
    }

    isAuthenticated(): boolean {
        return (this.getToken() != null);
    }

    getToken(): string {
        return this.getCount() > 0 ? this.getEntity(0).accessToken : null;
    }
}