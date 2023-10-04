import { Router } from '@angular/router';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationStore } from '../../Stores/authentication.store';
import { AuthenticationQuery } from '../../Queries/authentication.query';
import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { from } from 'rxjs';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';

describe('Login Component', () => {

    let router: Router;
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;

    let authenticationService: AuthenticationService;
    let authenticationStore: AuthenticationStore;
    let authenticationQuery: AuthenticationQuery;

    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                getTranslationTestingModule()
            ],
            declarations: [
                LoginComponent
            ],
            providers: [
                {
                    provide: ComponentFixtureAutoDetect,
                    useValue: true
                },
                AuthenticationStore,
                AuthenticationQuery,
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub
                }
            ]
        }).compileComponents();
    });

    beforeAll(async () => {
        router = TestBed.inject(Router);
        spyOn(router, 'navigateByUrl');

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeAll(async () => {
        authenticationService = TestBed.inject(AuthenticationService);
        authenticationStore = TestBed.inject(AuthenticationStore);
        authenticationQuery = TestBed.inject(AuthenticationQuery);
    });

    it('Should exist', async () => {
        expect(component).toBeTruthy();
    });

    it('Should render login process', async () => {
        const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        const loginButton: HTMLButtonElement = nativeElement.querySelector('button');
        const progressImage: HTMLImageElement = nativeElement.querySelector('img');

        expect(loginButton.textContent.toLowerCase()).toContain('login');
        expect(loginButton.disabled).toBeFalsy();
        expect(progressImage).toBeNull();
    });

    it('Should render login success process', async () => {
        component.login();
        from(fixture.whenStable()).subscribe(() => {
            expect(authenticationQuery.isAuthenticated()).toBeTruthy();
        });
    });
});
