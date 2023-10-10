import { Routes } from '@angular/router';

import { StatusComponent } from '../Components/Status/status.component';
import { LoginComponent } from '../Components/Login/login.component';
import { ProfileComponent } from '../Components/Profile/profile.component';
import { LogoutComponent } from '../Components/Logout/logout.component';
import { authenticationGuard } from '../Guards/authentication.guard';
import { loginGuard } from '../Guards/login.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'prefix'
    },    
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'status',
        component: StatusComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
