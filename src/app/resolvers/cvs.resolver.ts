import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Cv } from 'app/types/cv.types';
import { CvService } from 'app/services/cv.service';

@Injectable({
     providedIn: 'root'
})
export class CvsResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(private _cvService: CvService) {
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cv[]> {
          return this._cvService.getCvs();
     }
}

@Injectable({
     providedIn: 'root'
})
export class CvResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(
          private _router: Router,
          private _cvService: CvService
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cv> {
          return this._cvService.getCvById(route.paramMap.get('id'))
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
