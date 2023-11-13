import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PermissionService } from '../permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private permissionService: PermissionService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const requiredPermissions = route.data.requiredPermissions as string[];
    return this.permissionService.hasPermission(requiredPermissions).pipe(
      map((hasPermission) => {
        if (hasPermission) {
          return true;
        } else {
          return this.router.parseUrl('/home'); // Redirect to access denied page
        }
      })
    );
  }

}
