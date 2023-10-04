import { Router } from '@angular/router';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { NavigationComponent } from './navigation.component';
import { setUpMock } from "../../Managers/storage.mock";
import { AuthenticationStore } from "../../Stores/authentication.store";
import { AuthenticationQuery } from "../../Queries/authentication.query";
import { AuthenticationService } from "../../Services/authentication.service";
import { AuthenticationServiceStub } from "../../Services/authentication.service.stub";
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';

let fixture: ComponentFixture<NavigationComponent>;
let component: NavigationComponent
let authenticationService: AuthenticationService;
let authenticationStore: AuthenticationStore;
let authenticationQuery: AuthenticationQuery;

describe('Navigation Component', () => {
    
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
                NavigationComponent
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
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
    });

    beforeAll(async () => {
        authenticationService = TestBed.inject(AuthenticationService);
        authenticationStore = TestBed.inject(AuthenticationStore);
        authenticationQuery = TestBed.inject(AuthenticationQuery);
    });

    it('Should exist', async () => {
        expect(component).toBeTruthy();
    });

    it('Should not render navigation', async () => {
        let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        let navigationElement: HTMLElement = nativeElement.querySelector('nav');

        expect(navigationElement).toBeNull();
    });

    it('Should render navigation', async () => {
        authenticationService.login();
        authenticationService.refreshToken().subscribe(() => {
            let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
            let navigationElement: HTMLElement = nativeElement.querySelector('nav');
            expect(navigationElement).toBeDefined();
        });
    });

});
