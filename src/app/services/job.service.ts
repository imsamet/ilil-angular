import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Job } from 'app/types/job.types';
import { baseURL } from 'app/shared/baseUrl';

@Injectable({
     providedIn: 'root'
})
export class JobService {

     private _job: BehaviorSubject<Job | null> = new BehaviorSubject(null);
     private _jobs: BehaviorSubject<Job[] | null> = new BehaviorSubject(null);

     constructor(private _httpClient: HttpClient) {
     }

     get jobs$(): Observable<Job[]> {
          return this._jobs.asObservable();
     }

     get job$(): Observable<Job> {
          return this._job.asObservable();
     }

     getJobs(): Observable<Job[]> {
          return this._httpClient.get<Job[]>(baseURL + "jobs").pipe(
               tap((response: any) => {
                    this._jobs.next(response);
               })
          );
     }

     getJobById(id: string): Observable<Job> {
          return this._httpClient.get<Job>(baseURL + "jobs/" + id).pipe(
               map((job) => {
                    this._job.next(job);
                    return job;
               }),
               switchMap((job) => {

                    if (!job) {
                         return throwError('Could not found job with id of ' + id + '!');
                    }

                    return of(job);
               })
          );
     }

     createJob(data: any): Observable<Job> {
          return this._httpClient.post<Job>(baseURL + "jobs", data).pipe(
               tap((response: any) => {
                    return response
               })
          );
     }

     updateJob(id: string, data: any): Observable<Job> {
          return this._httpClient.put<Job>(baseURL + "jobs/" + id, data).pipe(
               tap((response: any) => {
                    return response
               })
          );
     }

     getJobsByLimit(limit: number): Observable<Job[]> {
          return this._httpClient.get<Job[]>(baseURL + "jobs/get/byLimit/" + limit)
     }
}
