import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { AuthenticationStore } from '../Stores/authentication.store';
import { AuthenticationState } from '../States/authentication.state';


@Injectable()
export class AuthenticationQuery extends Query<AuthenticationState> {
    constructor(protected store: AuthenticationStore) {
        super(store);
    }

    isAuthenticated(): boolean {
        return (this.getToken() != null);
    }

    getToken(): string {
        return this.getValue().authentication != null ? this.getValue().authentication.accessToken : null;
    }
}