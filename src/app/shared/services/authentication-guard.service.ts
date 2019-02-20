import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  canActivate(route, state: RouterStateSnapshot) {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    }
    // navigate user to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
