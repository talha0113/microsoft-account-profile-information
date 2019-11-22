import { Router } from '@angular/router';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutComponent } from './logout.component';
import { ProfileStore } from '../../Stores/profile.store';
import { ProfileQuery } from '../../Queries/profile.query';
import { ProfileService } from '../../Services/profile.service';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationStore } from '../../Stores/authentication.store';
import { AuthenticationQuery } from '../../Queries/authentication.query';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';

describe('Logout Component', () => {

    let fixture: ComponentFixture<LogoutComponent>;
    let component: LogoutComponent;
    let router: Router;
    let authenticationQuery: AuthenticationQuery;

    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule,
                getTranslationTestingModule()
            ],
            declarations: [
                LogoutComponent
            ],
            providers: [
                {
                    provide: ComponentFixtureAutoDetect,
                    useValue: true
                },
                ProfileStore,
                ProfileQuery,
                ProfileService,
                AuthenticationStore,
                AuthenticationQuery,
                AuthenticationService
            ]
        }).compileComponents();        
    });   

    beforeAll(async () => {
        authenticationQuery = TestBed.get(AuthenticationQuery);

        router = TestBed.get(Router);
        spyOn(router, 'navigateByUrl');
    });

    beforeAll(async () => {
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
    });


    it('Should exist', async () => {
        expect(component).toBeTruthy();
    });

    it('Should render logout', async () => {
        let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        let logoutButton: HTMLButtonElement = nativeElement.querySelector('button');

        expect(logoutButton).toBeDefined();
    });

    it('Should logout', async () => {
        let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        let logoutButton: HTMLButtonElement = nativeElement.querySelector('button');

        logoutButton.click();
        expect(authenticationQuery.isAuthenticated()).toBeFalsy();
    });
    
});
