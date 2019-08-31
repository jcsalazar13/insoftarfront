import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserResolved, User } from './user';
import { Observable, of, EMPTY } from 'rxjs';
import { UserService } from './user.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<UserResolved> {
  constructor(private userService: UserService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserResolved> {
    const id = route.paramMap.get('id');
    return this.userService.getUser(+id).pipe(
      map((user: User) => {
        if (user.id === null) {
          this.router.navigate([''], { queryParams: { notFound: true } });
          return { user: null };
        }
        return { user: user };
      }),
      catchError(error => {
        const message = `Retrieval error: ${error}`;
        return of({ user: null, error: message });
      })
    );
  }
}
