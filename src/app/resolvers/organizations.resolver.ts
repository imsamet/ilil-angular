import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Organization } from 'app/types/organization.types';
import { OrganizationService } from 'app/services/organization.service';

@Injectable({
     providedIn: 'root'
})
export class OrganizationsResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(private _organizationService: OrganizationService) {
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------

     /**
      * Resolver
      *
      * @param route
      * @param state
      */
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Organization[]> {
          return this._organizationService.getOrganizations();
     }
}

@Injectable({
     providedIn: 'root'
})
export class OrganizationResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(
          private _router: Router,
          private _organizationService: OrganizationService
     ) {
     }

     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------

     /**
      * Resolver
      *
      * @param route
      * @param state
      */
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Organization> {
          return this._organizationService.getOrganizationById(route.paramMap.get('id'))
               .pipe(
                    // Error here means the requested task is not available
                    catchError((error) => {

                         // Log the error
                         console.error(error);

                         // Get the parent url
                         const parentUrl = state.url.split('/').slice(0, -1).join('/');

                         // Navigate to there
                         this._router.navigateByUrl(parentUrl);

                         // Throw an error
                         return throwError(error);
                    })
               );
     }
}
