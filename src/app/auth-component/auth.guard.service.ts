/* This class would help guard the routes to any un-authenticated logins or signups. Only if the user is logged
in or signed up will be allowed to move in to other route pages of the application. */

import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /* It recieves the currently active route and its state as per the required arguments of this function. This
  can activate guard will be used in front of all the routes which need to be protected in routing modules. Apart
  from boolean values in observables or a promise, this can also return the UrlTree in the promise or observable.
  This feature was specially added for auth use case so that we can navigate to the auth page whenever the unknown
  user tries to directly enter into guarded routes. Earlier when we didn't have Url tree, we would have used tap
  to navigate using the boolean value. */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {

    /* We will find out whether the user is authenticated or not by looking at the user behavior subject. This
    user returns an user object observable, but we need to return a boolean value. So we will use map operator
    inside pipe to transform the observable value. It will return true if the user is present */
    return this.authService.user.pipe(take(1), map(user => {
      const isAuth = user ? true : false;
      if (isAuth) {
        return true;
      } else {
        /* So if the user is not present we will return the url tree pointing to auth page. */
        return this.router.createUrlTree(['/auth']);
      }
    }));
  }

}
