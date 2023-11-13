import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from "rxjs";

import { baseURL } from "app/shared/baseUrl";
import { ProcessHttpmsgService } from "./process-httpmsg.service";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    private _cv: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _cvs: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _location: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _locations: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _category: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _blog: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _blogs: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _jobs: BehaviorSubject<any[] | null> = new BehaviorSubject(null);


    constructor(private _httpClient: HttpClient, private processHTTPMsgService: ProcessHttpmsgService) { }

    get blogs$(): Observable<any[]> {
        return this._blogs.asObservable();
    }

    get blog$(): Observable<any> {
        return this._blog.asObservable();
    }

    get cvs$(): Observable<any[]> {
        return this._cvs.asObservable();
    }

    get cv$(): Observable<any> {
        return this._cv.asObservable();
    }

    get locations$(): Observable<any[]> {
        return this._locations.asObservable();
    }

    get location$(): Observable<any> {
        return this._location.asObservable();
    }

    get categories$(): Observable<any[]> {
        return this._categories.asObservable();
    }

    get category$(): Observable<any> {
        return this._category.asObservable();
    }

    getCvs(userId: string): Observable<any[]> {
        return this._httpClient.get<any[]>(baseURL + "cvs", {
            params: {
                userId: userId
            }
        }).pipe(
            tap((response: any) => {
                this._cvs.next(response);
            })
        );
    }

    getCvById(id: string): Observable<any> {
        return this._httpClient.get<any>(baseURL + "cvs/" + id).pipe(
            map((cv) => {
                this._cv.next(cv);
                return cv;
            }),
            switchMap((cv) => {
                if (!cv) {
                    return throwError("Could not found cv with id of " + id + "!");
                }

                return of(cv);
            })
        );
    }

    createCv(data: any) {
        return this._httpClient.post<any>(baseURL + "cvs", data).pipe(catchError(this.processHTTPMsgService.handlError));
    }

    updateCv(id: string, data: any) {
        return this._httpClient.put<any>(baseURL + "cvs/" + id, data).pipe(catchError(this.processHTTPMsgService.handlError));
    }

    getLocatins(): Observable<any[]> {
        return this._httpClient.get<any[]>(baseURL + "locations").pipe(
            tap((response: any) => {
                this._locations.next(response);
            })
        );
    }

    getCategories(types: string[]): Observable<any[]> {
        return this._httpClient.get<any[]>(baseURL + "categories", {
            params: {
                types: types
            }
        }).pipe(
            tap((response: any) => {
                this._categories.next(response);
            })
        );
    }

    getBlogs(): Observable<any[]> {
        return this._httpClient.get<any[]>(baseURL + "blogs").pipe(
            tap((response: any) => {
                this._blogs.next(response);
            })
        );
    }

    getBlogsByLimit(limit: number): Observable<any[]> {
        return this._httpClient.get<any[]>(baseURL + "blogs/get/byLimit/" + limit);
    }

    getBlogId(id: any): Observable<any[]> {
        return this._httpClient.get<any>(baseURL + "blogs/" + id).pipe(
            map((blog) => {
                this._blog.next(blog);

                return blog;
            }),
            switchMap((blog) => {
                if (!blog) {
                    return throwError("Could not found blog with id of " + id + "!");
                }

                return of(blog);
            })
        );
    }

    getJobs(userId: string): Observable<any[]> {
        return this._httpClient.get<any[]>(baseURL + "jobs", {
            params: {
                userId: userId
            }
        }).pipe(
            tap((response: any) => {
                this._jobs.next(response);
            })
        );
    }

    createJob(data: any) {
        return this._httpClient.post<any>(baseURL + "jobs", data).pipe(catchError(this.processHTTPMsgService.handlError));
    }

    updateJob(id: string, data: any) {
        return this._httpClient.put<any>(baseURL + "jobs/" + id, data).pipe(catchError(this.processHTTPMsgService.handlError));
    }

    createFeedback(data: any) {
        return this._httpClient.post<any>(baseURL + "feedbacks", data).pipe(catchError(this.processHTTPMsgService.handlError));
    }

}
