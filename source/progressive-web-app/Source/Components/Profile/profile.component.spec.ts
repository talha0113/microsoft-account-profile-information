import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfileComponent } from './profile.component';
import { setUpMock } from '../../Managers/storage.mock';
import { ProfileServiceMock } from '../../Services/profile.service.mock';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
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
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserTestingModule,
      ],
      declarations: [ProfileComponent, SafeUrlPipe],
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
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
    expect(component).toBeTruthy();
    ProfileServiceMock.metaDataRequest(httpClientMock);
    ProfileServiceMock.pictureRequest(httpClientMock);
    httpClientMock.verify({ ignoreCancelled: true });
  });

  it('Should render profile', () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const profileNameDiv: HTMLHeadingElement =
      nativeElement.querySelector('h3');
    expect(profileNameDiv).toBeDefined();
  });
});
