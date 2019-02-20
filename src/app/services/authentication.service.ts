import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../shared/models/user';
import { UserLogin } from '../shared/models/userLogin';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserAccount } from '../shared/models/userAccount';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  user: User;

  constructor(private apiService: ApiService, private jwtHelper: JwtHelperService, private jwtService: JwtService) { }

  login(userLogin: UserLogin): Observable<any> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    return this.apiService.create('user/login', userLogin, options)
      .pipe(map(response => {
        if (response.bearerToken) {
          this.jwtService.saveToken(response.bearerToken);
          localStorage.removeItem('isGuest');
        }
        return response;
      }));
  }

  logout() {
    this.jwtService.destroyToken();
  }

  resetPassword(userId: string): Observable<boolean> {
    return this.apiService.create('user/resetpassword', { 'userId': userId })
      .pipe(map(response => {
        if (response) {
          return true;
        }
        return false;
      }));
  }

  changePassword(userAccount: UserAccount): Observable<any> {
    // console.log(userAccount);
    return this.apiService.create('user/userresetpassword', userAccount);
  }

  get currentUserFullName(): string {
    if (this.decodedToken() != null) {
      const decodedResponse = this.decodedToken();
      const username = decodedResponse.name;
      // const username = decodedResponse.person.firstName + ' ' + decodedResponse.person.lastName;
      return username;
    }
  }

  get UserId(): string {
    if (this.decodedToken() != null) {
      const decodedResponse = this.decodedToken();
      const userId = decodedResponse.userId;
      return userId;
    }
  }

  get isAdmin() {
    if (this.decodedToken() != null) {
      const roles = this.decodedToken().roles;
      if (roles) {
        return roles.includes('Admin');
      }
    }
  }
  private decodedToken(): User {
    const token = this.jwtService.getToken();
    if (!token) {
      return null;
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    //    console.log(decodedToken);
    this.user = { ...decodedToken, roles: decodedToken.roles };
    // console.log(decodedToken);
    return this.user;
  }

  isLoggedIn() {
    if (this.jwtHelper.isTokenExpired(this.jwtService.getToken())) {
      return false;
    } else { return true; }
  }

  isGuest() {
    if (localStorage.getItem('isGuest')) {
      return true;
    } else { return false; }
  }

  loadAuth2(xyz: AuthenticationService) {
    gapi.load('auth2', () => {
      gapi.auth2.authorize({
        client_id: `${environment.clientId}`,
        scope: 'https://www.googleapis.com/auth/youtube',
        prompt: 'consent',
        response_type: 'code',
      }, function (response) {
        if (response.error) {
          return;
        }
        xyz.apiService.getAPI('oauth/redirect?code=' + response.code).subscribe();
      });
    });
    // xyz.apiService.getAPI('oauth/request').subscribe();
  }
}
