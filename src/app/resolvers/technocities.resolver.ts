import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Technocity } from 'app/types/technocity.types';
import { TechnocityService } from 'app/services/technocity.service';

@Injectable({
     providedIn: 'root'
})
export class TechnocitiesResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(private _technocityService: TechnocityService) {
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Technocity[]> {
          return this._technocityService.getTechnocities();
     }
}

@Injectable({
     providedIn: 'root'
})
export class TechnocityResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(
          private _router: Router,
          private _technocityService: TechnocityService
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Technocity> {
          return this._technocityService.getTechnocityById(route.paramMap.get('id'))
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
