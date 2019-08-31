import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User, UsersResolved } from './user';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UsersResolver implements Resolve<UsersResolved> {
  constructor(private userService: UserService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UsersResolved> {
    return this.userService.getUsers().pipe(
      map((users: User[]) => ({ users: users})),
      catchError(error => {
        const message = `Retrieval error: ${error}`;
        return of({ users: [], error: message });
      })
    );
  }
}
