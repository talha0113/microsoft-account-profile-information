import { describe, expect, it } from "vitest";
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect, } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationService } from 'Source/Services/authentication.service';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';

let fixture: ComponentFixture<NavigationComponent>;
let component: NavigationComponent;
let authenticationService: AuthenticationService;

describe('Navigation Component', () => {
    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            imports: [getTranslationTestingModule(), NavigationComponent],
            providers: [
                {
                    provide: ComponentFixtureAutoDetect,
                    useValue: true,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                AuthenticationRepository,
            ],
        }).compileComponents();
    });

    beforeAll(async () => {
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
    });

    beforeAll(async () => {
        authenticationService = TestBed.inject(AuthenticationService);
    });

    it('Should exist', async () => {
        expect(component).toBeTruthy();
    });

    it('Should not render navigation', async () => {
        const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        const navigationElement: HTMLElement = nativeElement.querySelector('nav');

        expect(navigationElement).toBeNull();
    });

    it('Should render navigation', async () => {
        authenticationService.login();
        authenticationService.refreshToken().subscribe(() => {
            const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
            const navigationElement: HTMLElement = nativeElement.querySelector('nav');
            expect(navigationElement).toBeDefined();
        });
    });
});
