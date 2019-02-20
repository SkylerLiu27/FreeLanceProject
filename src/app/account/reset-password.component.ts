import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../shared/models/userAccount';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  oldPasswordPlaceholder: string;
  userAccount: UserAccount;
  confirmNewPassword: string;
  oldPasswordWrong = false;
  constructor(private authService: AuthenticationService, private route: ActivatedRoute,
    private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userAccount = new UserAccount();
    const queryParams = this.route.snapshot.queryParamMap;
    if (queryParams.has('uid')) {
      this.userService.getUserById(queryParams.get('uid')).subscribe(data => this.userAccount.username = data.userName);
      this.oldPasswordPlaceholder = 'Default Password';
    }
    if (queryParams.has('uname')) {
      this.userAccount.username = queryParams.get('uname');
      this.oldPasswordPlaceholder = 'Old Password';
    }
  }

  onSubmit(model: UserAccount) {
    this.authService.changePassword(this.userAccount).subscribe(
      result => {
        console.log(result);
        if (result.successful === false) {
          console.log('wrong old password!');
          this.oldPasswordWrong = true;
        } else {
          this.router.navigate(['/login/']);
        }
      }
    );

  }

}
