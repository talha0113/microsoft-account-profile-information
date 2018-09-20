import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { appRoutes } from '../Routes/main.route';
import { MainComponent } from '../Components/Main/main.component';
import { LoginComponent } from '../Components/Login/login.component';
import { StatusComponent } from '../Components/Status/status.component';
import { ProfileComponent } from '../Components/Profile/profile.component';
import { LogoutComponent } from '../Components/Logout/logout.component';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationGuard } from '../Guards/authentication.guard';
import { LoginGuard } from '../Guards/login.guard';
import { ProfileInterceptor } from '../Interceptors/profile.interceptor';
import { ProfileService } from '../Services/profile.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationComponent } from '../Components/Navigation/navigation.component';
import { AuthenticationStore } from '../Stores/authentication.store';
import { AuthenticationQuery } from '../Queries/authentication.query';
import { SafeUrlPipe } from '../Pipes/safe-url.pipe';
import { ProfileStore } from '../Stores/profile.store';
import { ProfileQuery } from '../Queries/profile.query';

@NgModule({
    declarations: [
        MainComponent,
        NavigationComponent,
        LoginComponent,
        StatusComponent,
        ProfileComponent,
        LogoutComponent,
        SafeUrlPipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [        
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ProfileInterceptor,
            multi: true
        },
        AuthenticationStore,
        AuthenticationQuery,
        ProfileStore,
        ProfileQuery,
        LoginGuard,
        AuthenticationGuard,
        ProfileService,
        AuthenticationService
    ],
    bootstrap: [
        MainComponent
    ]
})
export class MainModule { }
