import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { baseURL } from 'app/shared/baseUrl';
import { Tender } from 'app/types/tender.types';

@Injectable({
    providedIn: 'root'
})
export class TenderService {

    private _tender: BehaviorSubject<Tender | null> = new BehaviorSubject(null);
    private _tenders: BehaviorSubject<Tender[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    get tenders$(): Observable<Tender[]> {
        return this._tenders.asObservable();
    }

    get tender$(): Observable<Tender> {
        return this._tender.asObservable();
    }

    getTenders(userId?: string): Observable<Tender[]> {
        return this._httpClient.get<Tender[]>(baseURL + "tenders", {
            params: {
                userId: userId
            }
        }).pipe(
            tap((response: any) => {
                this._tenders.next(response);
            })
        );
    }

    getTenderById(id: string): Observable<Tender> {
        return this._httpClient.get<Tender>(baseURL + "tenders/" + id).pipe(
            map((tender) => {
                this._tender.next(tender);
                return tender;
            }),
            switchMap((tender) => {

                if (!tender) {
                    return throwError('Could not found tender with id of ' + id + '!');
                }

                return of(tender);
            })
        );
    }

    createTender(data: any): Observable<Tender> {
        return this._httpClient.post<Tender>(baseURL + "tenders", data).pipe(
            tap((response: any) => {
                return response
            })
        );
    }

    updateTender(id: string, data: any): Observable<Tender> {
        return this._httpClient.put<Tender>(baseURL + "tenders/" + id, data).pipe(
            tap((response: any) => {
                return response
            })
        );
    }


    getTendersBylimit(limit: number): Observable<Tender[]> {
        return this._httpClient.get<Tender[]>(baseURL + "tenders/get/byLimit/" + limit);
    }
}
