import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { baseURL } from 'app/shared/baseUrl';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _users: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    set users(value: User[]) {
        // Store the value
        this._users.next(value);
    }

    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(userId: string): Observable<User> {
        return this._httpClient.get<User>(baseURL + `users/${userId}`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    getUsers(): Observable<User[]> {
        return this._httpClient.get<User[]>(baseURL + `users`).pipe(
            tap((users) => {
                this._users.next(users);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(userId: string, user: User): Observable<any> {
        return this._httpClient.patch<User>(baseURL + `users/${userId}`, { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    updateUser(userId: string, user: any): Observable<any> {
        return this._httpClient.put<User>(baseURL + `users/${userId}`, user).pipe(
            map((result) => {
                return result;
            })
        );
    }

    changePassword(userId: string, body: any): Observable<any> {
        return this._httpClient.put<User>(baseURL + `users/reset-password/${userId}/by-old-password`, body).pipe(
            map((result) => {
                return result;
            })
        );
    }

    deleteUser(userId: string): Observable<any> {
        return this._httpClient.delete<User>(baseURL + `users/${userId}`).pipe(
            map((result) => {
                return result;
            })
        );
    }
}
