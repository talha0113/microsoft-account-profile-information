import { vi, describe, expect, it } from 'vitest';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { SwUpdate, ServiceWorkerModule, SwPush } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { appRoutes } from '../../Routes/main.route';
import { MainComponent } from './main.component';
import { LoginComponent } from '../Login/login.component';
import { StatusComponent } from '../Status/status.component';
import { ProfileComponent } from '../Profile/profile.component';
import { LogoutComponent } from '../Logout/logout.component';
import { NavigationComponent } from '../Navigation/navigation.component';
import { SafeUrlPipe } from '../../Pipes/safe-url.pipe';
import { AuthenticationService } from 'Source/Services/authentication.service';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { ProfileService } from '../../Services/profile.service';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { setUpMock } from '../../Managers/storage.mock';
import { environment } from 'Configurations/Environments/environment';
import { NotificationService } from '../../Services/notification.service';
import { PushService } from '../../Services/push.service';
import { FormsModule } from '@angular/forms';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { FlagComponent } from '../Flag/flag.component';
import { SignalRService } from '../../Services/signalr.service';

describe('Main Component', () => {
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<MainComponent>;
  let component: MainComponent;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
        }),
        getTranslationTestingModule(),
        FlagComponent,
        MainComponent,
        NavigationComponent,
        LoginComponent,
        StatusComponent,
        ProfileComponent,
        LogoutComponent,
        SafeUrlPipe,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(appRoutes),
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceStub,
        },
        AuthenticationRepository,
        ProfileRepository,
        ProfileService,
        NotificationService,
        PushService,
        SignalRService,
        SwUpdate,
        SwPush,
      ],
    }).compileComponents();
  });

  beforeAll(async () => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  beforeAll(async () => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create the main', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    expect(nativeElement.querySelector('h1')).toBeDefined();
  });

  it('navigate to "" redirects you to /login', async () => {
    vi.spyOn(location, 'path').mockReturnValue('/login');
    await router.navigateByUrl('');
    expect(location.path()).toBe('/login');
  });

  it('navigate to "unknown" takes you to /login', async () => {
    vi.spyOn(location, 'path').mockReturnValue('/login');
    await router.navigateByUrl('/unknown');
    expect(location.path()).toBe('/login');
  });

  it('navigate to "login" takes you to /login', async () => {
    vi.spyOn(location, 'path').mockReturnValue('/login');
    await router.navigateByUrl('/login');
    expect(location.path()).toBe('/login');
  });

  it('navigate to "status" takes you to /status', async () => {
    vi.spyOn(location, 'path').mockReturnValue('/status');
    await router.navigateByUrl('/status');
    expect(location.path()).toBe('/status');
  });

  it('navigate to "profile" takes you to /profile', async () => {
    vi.spyOn(location, 'path').mockReturnValue('/profile');
    await router.navigateByUrl('/profile');
    expect(location.path()).toBe('/profile');
  });

  it('navigate to "logout" takes you to /logout', async () => {
    vi.spyOn(location, 'path').mockReturnValue('/logout');
    await router.navigateByUrl('/logout');
    expect(location.path()).toBe('/logout');
  });
});
