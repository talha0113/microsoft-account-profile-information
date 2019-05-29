import { Injectable } from '@angular/core';
import { StoreConfig, transaction, Store } from '@datorama/akita';

import { Authentication } from '../Models/authentication.model';
import { AuthenticationState } from '../States/authentication.state';
import { StorageManager } from '../Managers/storage.manager';
import { TokenConstant } from '../Constants/token.constant';


function createInitialState(): AuthenticationState {
    let authenticationInformation: Authentication = StorageManager.get<Authentication>(TokenConstant.token);
    if (authenticationInformation == null) {
        authenticationInformation = new Authentication(null, null);
    }
    return {
        authentication: authenticationInformation
    };
}

function createAuthenticationState(authenticationInformation: Authentication): AuthenticationState{
    StorageManager.remove(TokenConstant.token);
    StorageManager.add<Authentication>(TokenConstant.token, authenticationInformation);
    return {
        authentication: authenticationInformation
    };
}

@Injectable()
@StoreConfig({ name: 'authentication' })
export class AuthenticationStore extends Store<AuthenticationState> {
    constructor() {
        super(createInitialState());
    }

    @transaction()
    login(authenticationInformation: Authentication): void {
        this.update(createAuthenticationState(authenticationInformation));
    }

    @transaction()
    refreshToken(token: string): void {
        let authenticationInformation: Authentication = StorageManager.get<Authentication>(TokenConstant.token);
        authenticationInformation.accessToken = token;
        this.update(createAuthenticationState(authenticationInformation));
    }

    @transaction()
    logout(): void {
        StorageManager.remove(TokenConstant.token);
        sessionStorage.clear();
        this.update(createInitialState);
    }
}