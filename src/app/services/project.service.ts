import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Project } from 'app/types/project.types';
import { baseURL } from 'app/shared/baseUrl';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private _project: BehaviorSubject<Project | null> = new BehaviorSubject(null);
    private _projects: BehaviorSubject<Project[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    get projects$(): Observable<Project[]> {
        return this._projects.asObservable();
    }

    get project$(): Observable<Project> {
        return this._project.asObservable();
    }

    getProjects(userId?: string): Observable<Project[]> {
        return this._httpClient.get<Project[]>(baseURL + "projects", {
            params: {
                userId: userId
            }
        }).pipe(
            tap((response: any) => {
                this._projects.next(response);
            })
        );
    }

    getProjectById(id: string): Observable<Project> {
        return this._httpClient.get<Project>(baseURL + "projects/" + id).pipe(
            map((project) => {
                this._project.next(project);
                return project;
            }),
            switchMap((project) => {

                if (!project) {
                    return throwError('Could not found project with id of ' + id + '!');
                }

                return of(project);
            })
        );
    }

    createProject(data: any): Observable<Project> {
        return this._httpClient.post<Project>(baseURL + "projects", data).pipe(
            tap((response: any) => {
                return response
            })
        );
    }

    updateProject(id: string, data: any): Observable<Project> {
        return this._httpClient.put<Project>(baseURL + "projects/" + id, data).pipe(
            tap((response: any) => {
                return response
            })
        );
    }

    getProjectsByLimit(limit: number): Observable<Project[]> {
        return this._httpClient.get<Project[]>(baseURL + "projects/get/byLimit/" + limit)
    }
}
