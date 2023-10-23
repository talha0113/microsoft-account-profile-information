import { Router } from '@angular/router';
import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutComponent } from './logout.component';
import { ProfileService } from '../../Services/profile.service';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationService } from '../../Services/authentication.service';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { tap } from 'rxjs';

describe('Logout Component', () => {
  let fixture: ComponentFixture<LogoutComponent>;
  let component: LogoutComponent;
    let router: Router;
    let repository: AuthenticationRepository;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        getTranslationTestingModule(),
      ],
      declarations: [LogoutComponent],
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
          ProfileService,
          ProfileRepository,
          {
              provide: AuthenticationService,
              useClass: AuthenticationServiceStub,
          },
          AuthenticationRepository
      ],
    }).compileComponents();
  });

    beforeAll(async () => {
        repository = TestBed.inject(AuthenticationRepository);

    router = TestBed.get(Router);
    spyOn(router, 'navigateByUrl');
  });

  beforeAll(async () => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
  });

  it('Should exist', async () => {
    expect(component).toBeTruthy();
  });

  it('Should render logout', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const logoutButton: HTMLButtonElement =
      nativeElement.querySelector('button');

    expect(logoutButton).toBeDefined();
  });

  it('Should logout', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const logoutButton: HTMLButtonElement =
      nativeElement.querySelector('button');

      logoutButton.click();
      repository.data$.pipe(tap((value) => {
          expect(value.data).toBeNull();
      }));
  });
});
