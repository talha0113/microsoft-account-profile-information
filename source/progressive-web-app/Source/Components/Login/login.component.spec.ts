import { vi, describe, expect, it } from 'vitest';
import { Router, provideRouter } from '@angular/router';
import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { from } from 'rxjs';

import { LoginComponent } from './login.component';
import { setUpMock } from '../../Managers/storage.mock';
import { AuthenticationService } from 'Source/Services/authentication.service';
import { AuthenticationServiceStub } from '../../Services/authentication.service.stub';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';

describe('Login Component', () => {
  let router: Router;
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let repository: AuthenticationRepository;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [getTranslationTestingModule(), LoginComponent],
      providers: [
        provideRouter([]),
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
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(async () => {
    repository = TestBed.inject(AuthenticationRepository);
  });

  it('Should exist', async () => {
    expect(component).toBeTruthy();
  });

  it('Should render login process', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const loginButton: HTMLButtonElement =
      nativeElement.querySelector('button');
    const progressImage: HTMLImageElement = nativeElement.querySelector('img');

    expect(loginButton.textContent.toLowerCase()).toContain('login');
    expect(loginButton.disabled).toBeTruthy();
    expect(progressImage).toBeDefined();
  });

  it('Should render login success process', async () => {
    component.login();
    from(fixture.whenStable()).subscribe(() => {
      expect(repository.data).toBeDefined();
    });
  });
});
