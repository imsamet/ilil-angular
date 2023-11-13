import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { PermissionService } from './permission.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        AuthService,
        PermissionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class AuthModule {
}
