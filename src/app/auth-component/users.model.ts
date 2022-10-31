/* Helps to store all the data that helps us to create a user. Also it will help in vaidating the user or 
whether the token exists or whether the token has expired or is still valid. */

export class Users {
  constructor(
    public email: string,
    public id: string,
    private _token: string, /* this will be private so that it is not accessed directly rather it is accessed 
                                through getter.*/
    private _tokenExpireDate: Date
  ) {}

  // getter method to access token. User cant overwrite the token then
  get token() {

    /* if token doesn't exist or token has expired, then no token will be returned. otherwise existing token
    will be returned */
    if (!this._tokenExpireDate || new Date() > this._tokenExpireDate) {
      return null;
    }

    return this._token;
  }
}
