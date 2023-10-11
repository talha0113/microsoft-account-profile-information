import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavigationComponent } from './navigation.component';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';

let fixture: ComponentFixture<NavigationComponent>;
let component: NavigationComponent;
let authenticationService: AuthenticationService;

describe('Navigation Component', () => {
  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        getTranslationTestingModule(),
      ],
      declarations: [NavigationComponent],
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceStub,
        },
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
