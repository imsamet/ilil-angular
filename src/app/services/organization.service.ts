import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Organization } from 'app/types/organization.types';
import { baseURL } from 'app/shared/baseUrl';

@Injectable({
     providedIn: 'root'
})
export class OrganizationService {

     private _organization: BehaviorSubject<Organization | null> = new BehaviorSubject(null);
     private _organizations: BehaviorSubject<Organization[] | null> = new BehaviorSubject(null);

     constructor(private _httpClient: HttpClient) {
     }

     get organizations$(): Observable<Organization[]> {
          return this._organizations.asObservable();
     }

     get organization$(): Observable<Organization> {
          return this._organization.asObservable();
     }

     getOrganizations(): Observable<Organization[]> {
          return this._httpClient.get<Organization[]>(baseURL + "organizations").pipe(
               tap((response: any) => {
                    this._organizations.next(response);
               })
          );
     }

     getOrganizationById(id: string): Observable<Organization> {
          return this._httpClient.get<Organization>(baseURL + "organizations/" + id).pipe(
               map((organization) => {
                    this._organization.next(organization);
                    return organization;
               }),
               switchMap((organization) => {

                    if (!organization) {
                         return throwError('Could not found organization with id of ' + id + '!');
                    }

                    return of(organization);
               })
          );
     }
}
