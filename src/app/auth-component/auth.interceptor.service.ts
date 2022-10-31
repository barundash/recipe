/* The auth action to get the latest user and have a nested observale scenario could have been done in the
data storage service of shared folder as this needs to be done for all the requests. So to make this functionality
genric interceptor has been used. 


*/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable() // the token is provided in core module.
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authservice: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /* Now that we know that the user is authenticated. How would the backend know that the user is authenticated?
    So for backend to know that the user is an authenticated user, we need to send a token along with request to
    give a proof of authentication. Let's say we fetch a recipe with the authenticated user. We will make sure
    that we get the user only once and then we are done, we take operator inside pipe to implement this. take(1)
    means that I want only one value from the observable and therafter is should automatically unsubscribe the
    observable. This would only give me the latest user because we would fetch the users on-demand and we wont
    get the users at the time we dont need them.
    exhaustMap waits for the first observable to complete that is the latest user. exhaustMap will get the user
    from previous observable, and within this we would return a new observable which will then replace the previous
    observable i.e. latest user one. So the new observable is the http request to fetch the recipes. 

    Now to send the token with the request for authentication, here we are passing the token with query parameter.
    Generally, in other REST APIs, we pass them in headers of requests.
    */
    return this.authservice.user.pipe(take(1), exhaustMap(user => {
      if (!user) {
        /* As user is not available, so no token. So we will send the original request. next.handle will handle
        this auth for each and every http request here.*/
        return next.handle(req);
      }
      /* Now to send the token as query parameter, we add a second method to the get method that is a JSON
      object where we can set params and create a new http params and set auth as user.token. So the request
      is modified now.*/
      const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
      /* next.handle will handle this auth for each and every http request here. So this is delivering one
      observable within the above observable. */
      return next.handle(modifiedReq);
    }));

  }
}
