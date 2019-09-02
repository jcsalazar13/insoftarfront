import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://insoftar.test/api/users';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(this.url, httpOptions).pipe(
      map(
        responseData =>
          responseData.data !== 'null'
            ? responseData.data
            : []
      ),
      catchError(this.handleError)
    );
  }

  getUser(id: number): Observable<User> {
    if (+id === 0) {
      return of(this.initializeUser());
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${this.url}/${id}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: User): Observable<boolean | any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(this.url, user, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: User): Observable<boolean | any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${this.url}/${user.id}`, user, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.delete<any>(`${this.url}/${id}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    let errors = [];
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error ocurred. Handle it accordingly.
      errorMessage = `An error ocurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      errors = Object.keys(err.error).map(key => err.error[key][0]);
    }
    return throwError(errors);
  }

  private initializeUser(): User {
    return {
      id: '',
      firstname: '',
      lastname: '',
      document: '',
      email: '',
      phone: '',
    };
  }
}
