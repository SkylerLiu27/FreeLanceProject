import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from '../../services/jwt.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import { RequiredValidator } from '@angular/forms';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private authService: AuthenticationService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = this.jwtService.getToken();
    const path = 'user/login';
    const resetpath = 'user/userresetpassword';
    const url = `${environment.api_url}${path}`;
    const resetPathUrl = `${environment.api_url}${resetpath}`;
    console.log('url is: ' + url);
    console.log('request url is: ' + req.url);
    if (this.authService.isLoggedIn()) {
      headersConfig['Authorization'] = `${token}`;
      const authReq = req.clone({ setHeaders: headersConfig });
      return next.handle(authReq);
    } else {
      if (!this.authService.isGuest() && req.url !== url) {
        if (req.url === resetPathUrl) {
          return next.handle(req);
        } else {
          this.router.navigateByUrl('/login');
          return next.handle(req);
        }
      } else {
        return next.handle(req);
      }

    }
  }
}
