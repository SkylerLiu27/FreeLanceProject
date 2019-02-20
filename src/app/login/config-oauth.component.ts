import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../shared/models/user';
import { ApiService } from '../services/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, debounceTime } from 'rxjs/operators';



@Component({
  selector: 'app-config-oauth',
  templateUrl: './config-oauth.component.html',
  styleUrls: ['./config-oauth.component.scss']
})
export class ConfigOauthComponent implements OnInit {

  public authIsLoaded = false;
  public isLoggedIn = false;
  public user: User;

  constructor(private authenticatorService: AuthenticationService, private apiService: ApiService,
    private router: Router, @Inject(DOCUMENT) private document: any) { }

  signInForYoutube(): void {
    this.apiService.getAPI('oauth/url?resourcetype=1').subscribe(data => this.document.location.href = data);

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      debounceTime(4000)
    ).subscribe(
      x => {
        this.router.navigate(['/config']); /* Redirect to Home */
      }
    );
  }

  signInForGmail(): void {
    this.apiService.getAPI('oauth/url?resourcetype=2').subscribe(data => this.document.location.href = data);

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      debounceTime(4000)
    ).subscribe(
      x => {
        this.router.navigate(['/config']); /*Redirect to Home*/
      }
    );
  }

  ngOnInit() { }
}
