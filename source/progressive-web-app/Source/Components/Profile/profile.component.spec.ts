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
import { Profile } from '../../Models/profile.model';

describe('Profile Component', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  let httpClientMock: HttpTestingController;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        BrowserTestingModule,
      ],
      declarations: [ProfileComponent, SafeUrlPipe],
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
      ],
    }).compileComponents();
  });

  beforeAll(async () => {
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  beforeAll(async () => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('Should exist', async () => {
    expect(component).toBeTruthy();
  });

  it('Should render profile', async () => {
    component.profileInformation$.subscribe((value: Profile) => {
      const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
      const profileNameDiv: HTMLHeadingElement =
        nativeElement.querySelector('h3');

      expect(profileNameDiv).toBeDefined();
      expect(value).toBeDefined();
    });

    ProfileServiceMock.metaDataRequest(httpClientMock);
    ProfileServiceMock.pictureRequest(httpClientMock);
    httpClientMock.verify();
  });
});
