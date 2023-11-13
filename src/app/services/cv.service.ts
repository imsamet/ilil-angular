import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Cv } from 'app/types/cv.types';
import { baseURL } from 'app/shared/baseUrl';

@Injectable({
     providedIn: 'root'
})
export class CvService {

     private _cv: BehaviorSubject<Cv | null> = new BehaviorSubject(null);
     private _cvs: BehaviorSubject<Cv[] | null> = new BehaviorSubject(null);

     constructor(private _httpClient: HttpClient) {
     }

     get cvs$(): Observable<Cv[]> {
          return this._cvs.asObservable();
     }

     get cv$(): Observable<Cv> {
          return this._cv.asObservable();
     }

     getCvs(): Observable<Cv[]> {
          return this._httpClient.get<Cv[]>(baseURL + "cvs").pipe(
               tap((response: any) => {
                    this._cvs.next(response);
               })
          );
     }

     getCvById(id: string): Observable<Cv> {
          return this._httpClient.get<Cv>(baseURL + "cvs/" + id).pipe(
               map((cv) => {
                    this._cv.next(cv);
                    return cv;
               }),
               switchMap((cv) => {

                    if (!cv) {
                         return throwError('Could not found cv with id of ' + id + '!');
                    }

                    return of(cv);
               })
          );
     }

     createCv(data: any): Observable<Cv> {
          return this._httpClient.post<Cv>(baseURL + "cvs", data).pipe(
               tap((response: any) => {
                    return response
               })
          );
     }

     updateCv(id: string, data: any): Observable<Cv> {
          return this._httpClient.put<Cv>(baseURL + "cvs/" + id, data).pipe(
               tap((response: any) => {
                    return response
               })
          );
     }

     getCvsByLimit(limit: number): Observable<Cv[]> {
          return this._httpClient.get<Cv[]>(baseURL + "cvs/get/byLimit/" + limit)
     }
}
