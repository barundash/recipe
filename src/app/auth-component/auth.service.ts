import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Users } from './users.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

/* This interface helps us to access the response data coming from the signup request. This interface will tell
us how the response data will look like. This is exacty the same as mentioned in the firebase doc. */
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; /* this is optional as this is coming as a response from login url but not from signup
                              url*/
}

@Injectable({providedIn: "root"})
export class AuthService {

  /* A new user is emitted whenever a user logs in or logs out when token is expired or user is cleared. The user
  is subscribed in header component to check whether the user exists or not to set isAuthenticated atteribute
  there to be true or false. Now why BehaviorSubject? BehaviorSubject gives the users immediate access to the
  previously emitted value if if they haven't subscribed to the value at the time it was emitted. It means we
  can get access to the current user even if we subscribe after the user has been emitted. It means if we fetch
  data and we need token at this time, even if the user logged in before that point of time we can get access to
  that user. Hence this is initialized with a starting value, in this case it is NULL because we don't want to
  start off directly with a user. This user is now called in interceptor for various functionalities.*/
  user = new BehaviorSubject<Users>(null);
  private tokenExpireTimer: any;

  constructor(private http: HttpClient, private route: Router) {}

  /* Helps the user to sign up for the first time by sending request to the firebase signup URL. The post body
  will be the JSON data expected by the endpoint. The keys should exactly match the cases in which the URL
  expects. The observable returned will be subscribed in the auth component so that the response can be visible
  on the page. */
  signUp(mail: string, pass: string) {
    /* the post method will return AuthResponseData type resonse in the observable. This AuthResponseData was
    defined as an interface above to know the structure of data coming in. */
    return this.http.post<AuthResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: mail,
        password: pass,
        returnSecureToken: true // This should always be true.
      })
      /* This would call the handle error function below to provide better error statements on the error coming
      as the reponse.*/
      .pipe(catchError(this.handleError), tap(resData => {
        /* As tap implements certain functionality without changing the response from the observable, here
        it is calling handle authentication implemented below which helps to create a new user and some more
        functionalities. */
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
  }

  /* Login request. */
  login(email: string, pass: string) {
    return this.http.post<AuthResponseData>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: pass,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      /* convert the expiresIn to a number using +. Handle authentication will take the response data coming in
      to create a new user */
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  /* Automatically set the user to login when the application starts. This will be done by looking into the storage
  by checking whether there is a user snapshot stored. */
  autoLogin() {
    /* this user data will be retrieved from local storage. As it is stored in the local storage as a string
    it needs to be converted to JSON again to use it. Now this will be called in ngOnInit of app component as
    this is the component which will be loaded first and will check if the token for the current user has expired
    or not. If not then this user will be auto logged in.*/
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpireDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    /* If there is no user data, we cant log the user in and he has to sign up. */
    if (!userData) {
      return;
    }

    /* Now the new user is created using the user data retrieved above. */
    const loadedUser = new Users(userData.email, userData.id, userData._token, new Date(userData._tokenExpireDate));

    /* The getter method of user model is called here. If it is not expired, then the user will be emitted for
    subscription. */
    if (loadedUser.token) {
      this.user.next(loadedUser);

      /* In this case where user is emitted for autologin with the existing token and it is not a brand new token
      we need to calculate the remaining time for expiration of this token. So the current time is subtracted from
      the expiration time and is sent as an argument to autologout. */
      const expireDuration = new Date(userData._tokenExpireDate).getTime() - new Date().getTime();
      this.autoLogout(expireDuration);
    }

  }

  /* This next in the logout action. basically to move to initial state of the user i.e. null. This is called
  in the header component to implement logout action. This would redirect back to auth page. */
  logout() {
    this.user.next(null);
    this.route.navigate(['/auth']);
    //On logging out the user data logged in is ceared out.
    localStorage.removeItem('userData');

    /* If the timer for token exists it should be cleared as otherwise autologout will still be in action even
    if we have logged out manually. */
    if (this.tokenExpireTimer) {
      clearTimeout();
    }
  }

  /* The method sets the timer for auto logout based on token expiration time. Whenever the user is emitted, 
  auto logout is set for that particular user and the token generated. */
  autoLogout(expireDuration: number) {
    /* Time out is set using callback function which implements logout function when the expiration time of the
    token is reached. Now if we are logging out manually, and this timer still exists, then after the expiration 
    time it will again call the logout function. So the timer needs to be cleared when we logout even manually.
    So this timer is stored in a property so that it can be used inside logout fuction where we manually logout. */
    this.tokenExpireTimer = setTimeout(() => {
      this.logout();
    }, expireDuration);
  }

  /* This is a generic function to create a new user and authenticate it. */
  handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    /* expiresIn attribute coming as a response from the auth request is a string which is nothing but a number
    in seconds that is the seconds from now in which the token will expire. This is converted to milliseconds
    as getTime is in milliseconds. This expireDate is passed as argument in the constructor below. */
    const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
    /* creates a new user by calling the users constructor from user model. */
    const user = new Users(email, id, token, expireDate);
    // Emit the user which shows that this is the current logged in user.
    this.user.next(user);
    // autologout is set for the user emitted with the expiresin time sent as an argument in milliseconds.
    this.autoLogout(expiresIn * 1000);

    /* Now Why localstorage? Once the user is authenticated and logged in we want to not only keep him logged in
    during navigation but also keep the tokan alive when we reload the page. Before having local storage into 
    picture when we reload the page we loose all the data because the angular application restarts so we loose
    the old navigated data. Till now we are storing the token in memory i.e user model and hence we loose the 
    state whenever the application restarts. There is not connection between the last run of application and this
    current run. So the token needs to be stored somewhere else rather than the memory.
    
    We need to stor it in persistent storage that survives page reloads and browser restarts. The storage is the
    local storage which is an API exposed by the browser which stores data in key value pairs on the file system
    but controlled by the browser. serItem allows us to write the data to local storage and store it. userdata is
    the key defined by us and user is the value to that key. So now that the user is stored in localstorage we
    can retrieve the token when the application restarts. Lets move to autologin method to see that.
    */
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /* This function is a generic function written for all the auth requests to handle the error coming in. If the
  error format doesnt match with the format being checked, then it would throw the default error message. */
  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An Unknown Error Occurred';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS': // For signup error
        errorMessage = 'The E-Mail already exists';
        break;
      case 'EMAIL_NOT_FOUND': // error during login
        errorMessage = 'The E-Mail does not exist';
        break;
      case 'INVALID_PASSWORD': // error during login
        errorMessage = 'The password is incorrect';
        break;
      }

    return throwError(errorMessage);
  }

}
