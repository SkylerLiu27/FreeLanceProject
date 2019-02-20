import { Component, OnInit } from '@angular/core';
import { SideBarService } from './shared/services/side-bar.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GentisPortal';
  isOpen = false;

  constructor(private sideBarService: SideBarService, public authService: AuthenticationService) {
  }

  ngOnInit() {
    this.sideBarService.change.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }
}
