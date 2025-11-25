import { describe, expect, it } from "vitest";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { appRoutes } from '../../Routes/main.route';
import { ProfileComponent } from './profile.component';
import { setUpMock } from '../../Managers/storage.mock';
import { ProfileServiceMock } from '../../Services/profile.service.mock';
import { SafeUrlPipe } from '../../Pipes/safe-url.pipe';
import { ProfileService } from '../../Services/profile.service';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { clearRequestsResult } from '@ngneat/elf-requests';

describe('Profile Component', () => {
    let fixture: ComponentFixture<ProfileComponent>;
    let component: ProfileComponent;
    let httpClientMock: HttpTestingController;

    beforeEach(() => {
        setUpMock();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProfileComponent, SafeUrlPipe],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter(appRoutes),

                ProfileService,
                ProfileRepository,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        clearRequestsResult();
        httpClientMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        TestBed.inject(ProfileRepository).remove();
    });

    it('Should exist', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        ProfileServiceMock.metaDataRequest(httpClientMock);
        ProfileServiceMock.pictureRequest(httpClientMock);
    });

    it('Should render profile', () => {
        const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        const profileNameDiv: HTMLHeadingElement = nativeElement.querySelector('h3');
        expect(profileNameDiv).toBeDefined();
    });

    afterEach(() => {
        httpClientMock.verify();
    });
});
