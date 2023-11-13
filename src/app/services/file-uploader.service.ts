import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseUrl';

@Injectable({
  providedIn: 'root'
})

export class FileUploaderService {

  constructor(private http: HttpClient) { }

  upload(file: File, route: string, filter: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${baseURL + route}/upload/${filter}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(route: string): Observable<any> {
    return this.http.get(`${baseURL + route}/files`);
  }

  delete(route, fileName): Observable<any> {
    return this.http.delete(`${baseURL + route}/files/${fileName}`);
  }

  deleteFiles(route, files): Observable<any> {
    return this.http.post(`${baseURL + route}/files`, { files: files });
  }

}