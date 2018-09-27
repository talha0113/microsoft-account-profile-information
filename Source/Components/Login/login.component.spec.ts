import { Router } from '@angular/router';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { LoginComponent } from './login.component';
import { setUpMock } from "../../Managers/storage.mock";
import { AuthenticationStore } from "../../Stores/authentication.store";
import { AuthenticationQuery } from "../../Queries/authentication.query";
import { AuthenticationService } from "../../Services/authentication.service";
import { AuthenticationServiceStub } from "../../Services/authentication.service.stub";
import { from } from "rxjs";

describe('Login Component', () => {

    let router: Router;
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent

    let authenticationService: AuthenticationService;
    let authenticationStore: AuthenticationStore;
    let authenticationQuery: AuthenticationQuery;

    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
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
        router = TestBed.get(Router);
        spyOn(router, 'navigateByUrl');

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeAll(async () => {
        authenticationService = TestBed.get(AuthenticationService);
        authenticationStore = TestBed.get(AuthenticationStore);
        authenticationQuery = TestBed.get(AuthenticationQuery);
    });

    it('Should exist', async () => {
        expect(component).toBeTruthy();
    });

    it('Should render login process', async () => {
        let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        let loginButton: HTMLButtonElement = nativeElement.querySelector('button');
        let progressImage: HTMLImageElement = nativeElement.querySelector('img');

        //expect(loginButton.textContent).toContain('Login');
        //expect(loginButton.disabled).toBeFalsy();
        expect(component.isInProgress).toBeFalsy();
        //expect(progressImage).toBeNull();
    });

    it('Should render login success process', async () => {
        component.login();
        from(fixture.whenStable()).subscribe(() => {
            expect(authenticationQuery.isAuthenticated()).toBeTruthy();
        });        
    });
    
});
