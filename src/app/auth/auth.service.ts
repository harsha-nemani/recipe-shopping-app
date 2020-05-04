import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api_key: string;

  constructor(private http: HttpClient) {
    http
      .get('assets/creds.json', { responseType: 'json' })
      .subscribe((data) => {
        this.api_key = data['api_key'];
        console.log(data);
      });
  }

  signUp(email: string, password: string) {
    console.log(this.api_key);
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        },
        {
          params: new HttpParams().set('key', this.api_key),
        }
      )
      .pipe(
        catchError((errorResponse) => {
          let errorMessage = 'An unknown error occured!';
          if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
          }
          switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already';
          }

          return throwError(errorMessage);
        })
      );
  }
}
