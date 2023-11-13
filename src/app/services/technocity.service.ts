import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Technocity } from 'app/types/technocity.types';
import { baseURL } from 'app/shared/baseUrl';

@Injectable({
     providedIn: 'root'
})
export class TechnocityService {

     private _technocity: BehaviorSubject<Technocity | null> = new BehaviorSubject(null);
     private _technocities: BehaviorSubject<Technocity[] | null> = new BehaviorSubject(null);

     constructor(private _httpClient: HttpClient) {
     }

     get technocities$(): Observable<Technocity[]> {
          return this._technocities.asObservable();
     }

     get technocity$(): Observable<Technocity> {
          return this._technocity.asObservable();
     }

     getTechnocities(): Observable<Technocity[]> {
          return this._httpClient.get<Technocity[]>(baseURL + "technocities").pipe(
               tap((response: any) => {
                    this._technocities.next(response);
               })
          );
     }

     getTechnocityById(id: string): Observable<Technocity> {
          return this._httpClient.get<Technocity>(baseURL + "technocities/" + id).pipe(
               map((technocity) => {
                    this._technocity.next(technocity);
                    return technocity;
               }),
               switchMap((technocity) => {

                    if (!technocity) {
                         return throwError('Could not found technocity with id of ' + id + '!');
                    }

                    return of(technocity);
               })
          );
     }
}
