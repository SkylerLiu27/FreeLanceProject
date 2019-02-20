import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, RouterStateSnapshot, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate  {

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  canActivate(route, state: RouterStateSnapshot) {
    // const expectedRole = route.data.expectedRole;
     console.log(this.authenticationService.isAdmin);
    if (this.authenticationService.isAdmin) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
