import { vi, describe, expect, it } from 'vitest';
import { Router, provideRouter } from '@angular/router';
import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LogoutComponent } from './logout.component';
import { ProfileService } from '../../Services/profile.service';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationService } from 'Source/Services/authentication.service';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { ProfileRepository } from '../../Repositories/profile.repository';
import { tap } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

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
      imports: [getTranslationTestingModule(), LogoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
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
        AuthenticationRepository,
      ],
    }).compileComponents();
  });

  beforeAll(async () => {
    repository = TestBed.inject(AuthenticationRepository);

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl');
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
    repository.data$.pipe(
      tap(value => {
        expect(value.data).toBeNull();
      })
    );
  });
});
