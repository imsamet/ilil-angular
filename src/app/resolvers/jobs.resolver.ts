import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Job } from 'app/types/job.types';
import { JobService } from 'app/services/job.service';

@Injectable({
     providedIn: 'root'
})
export class JobsResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(private _jobService: JobService) {
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Job[]> {
          return this._jobService.getJobs();
     }
}

@Injectable({
     providedIn: 'root'
})
export class JobResolver implements Resolve<any>
{
     /**
      * Constructor
      */
     constructor(
          private _router: Router,
          private _jobService: JobService
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Job> {
          return this._jobService.getJobById(route.paramMap.get('id'))
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
