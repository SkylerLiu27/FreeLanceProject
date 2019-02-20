import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../shared/models/userLogin';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../shared/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userLogin: UserLogin = {
    username: '',
    password: ''
  };
  invalidLogin: boolean;
  returnUrl: string;
  user: User;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthenticationService, private dataService: DataService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home/']);
    }

    if (this.route.snapshot.queryParamMap.has('rd')) {
      this.router.navigate(['config']);
    }
  }

  login() {
    this.authService.login(this.userLogin)
      .subscribe((response) => {
        if (response.loginResult === 'Fail') {
          this.invalidLogin = true;
          if (response.error === 'Password Expired') {
            this.router.navigate(['/resetpassword'], { queryParams: { 'uname': this.userLogin.username } });
            this.invalidLogin = true;
          }
        }
        if (response.loginResult !== 'Fail') {
          this.dataService.updateLibraryCounts();
          this.router.navigateByUrl(this.returnUrl);
        }
      },
        (err: any) => this.invalidLogin = true);
  }

  continueAsGuest() {
    localStorage.removeItem('token');
    localStorage.setItem('isGuest', 'true');
  }
}
