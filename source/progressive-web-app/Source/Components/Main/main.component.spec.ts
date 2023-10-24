import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate, ServiceWorkerModule, SwPush } from '@angular/service-worker';

import { appRoutes } from '../../Routes/main.route';
import { MainComponent } from './main.component';
import { LoginComponent } from '../Login/login.component';
import { StatusComponent } from '../Status/status.component';
import { ProfileComponent } from '../Profile/profile.component';
import { LogoutComponent } from '../Logout/logout.component';
import { NavigationComponent } from '../Navigation/navigation.component';
import { SafeUrlPipe } from '../../Pipes/safe-url.pipe';
import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { ProfileService } from '../../Services/profile.service';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { setUpMock } from '../../Managers/storage.mock';
import { environment } from 'Configurations/Environments/environment';
import { NotificationService } from '../../Services/notification.service';
import { PushService } from '../../Services/push.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
        HttpClientModule,
        FormsModule,
        RouterTestingModule.withRoutes(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
        }),
        getTranslationTestingModule(),
      ],
      declarations: [
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

  it('should create the main', async () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    expect(nativeElement.querySelector('h1').textContent).toBeTruthy();
  });

  it('navigate to "" redirects you to /login', async () => {
    spyOn(location, 'path').and.returnValue('/login');
    await router.navigateByUrl('');
    expect(location.path()).toBe('/login');
  });

  it('navigate to "unknown" takes you to /login', async () => {
    spyOn(location, 'path').and.returnValue('/login');
    await router.navigateByUrl('/unknown');
    expect(location.path()).toBe('/login');
  });

  it('navigate to "login" takes you to /login', async () => {
    spyOn(location, 'path').and.returnValue('/login');
    await router.navigateByUrl('/login');
    expect(location.path()).toBe('/login');
  });

  it('navigate to "status" takes you to /status', async () => {
    spyOn(location, 'path').and.returnValue('/status');
    await router.navigateByUrl('/status');
    expect(location.path()).toBe('/status');
  });

  it('navigate to "profile" takes you to /profile', async () => {
    spyOn(location, 'path').and.returnValue('/profile');
    await router.navigateByUrl('/profile');
    expect(location.path()).toBe('/profile');
  });

  it('navigate to "logout" takes you to /logout', async () => {
    spyOn(location, 'path').and.returnValue('/logout');
    await router.navigateByUrl('/logout');
    expect(location.path()).toBe('/logout');
  });
});
