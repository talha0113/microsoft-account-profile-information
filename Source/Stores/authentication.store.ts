import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig, getInitialActiveState, transaction, ID } from '@datorama/akita';

import { Authentication } from '../Models/authentication.model';
import { AuthenticationState } from '../States/authentication.state';
import { StorageManager } from '../Managers/storage.manager';
import { TokenConstant } from '../Constants/token.constant';

const state = {
    ...getInitialActiveState()
};

@Injectable()
@StoreConfig({ name: 'authentication', idKey: 'id' })
export class AuthenticationStore extends EntityStore<AuthenticationState, Authentication> {
    constructor() {
        super(state);
        this.initialEntity();
    }

    private initialEntity(): void {
        let authenticationInformation: Authentication = StorageManager.get<Authentication>(TokenConstant.token);
        if (authenticationInformation == null) {
            authenticationInformation = new Authentication(0, null, null);
        }
        this.set([authenticationInformation]);
    }

    @transaction()
    login(authenticationInformation: Authentication): void {
        this.set([authenticationInformation]);
        //this.update(0, authenticationInformation);
        StorageManager.remove(TokenConstant.token);
        StorageManager.add<Authentication>(TokenConstant.token, authenticationInformation);
    }

    @transaction()
    refreshToken(token: string): void {
        let authenticationInformation: Authentication = StorageManager.get<Authentication>(TokenConstant.token);
        authenticationInformation.accessToken = token;
        this.set([authenticationInformation]);
        StorageManager.remove(TokenConstant.token);
        StorageManager.add<Authentication>(TokenConstant.token, authenticationInformation);
    }

    @transaction()
    logout(): void {
        StorageManager.remove(TokenConstant.token);
        sessionStorage.clear();
        this.remove(0);      
        this.initialEntity();
    }
}