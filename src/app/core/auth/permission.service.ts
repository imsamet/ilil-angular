import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable, map } from 'rxjs';

@Injectable()
export class PermissionService {

     constructor(
          private _userService: UserService
     ) {
     }

     hasPermission(permissions: string[]): Observable<boolean> {
          return this._userService.user$.pipe(
               map((user) => {
                    return permissions.some((permission) => user.roles.includes(permission));
               })
          );
     }
}
