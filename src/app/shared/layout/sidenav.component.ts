import { Component, OnInit } from '@angular/core';
import { SideBarService } from '../services/side-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { DataService } from '../services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  tagCounts = []; // { 'Java Developer': 5, 'Angular': 100, 'Net Developer': 40 };
  libraryTypeCounts = [];
  libraryTypeKeys = [];
  tagKeys = [];
  isOpen = false;
  constructor(private sideBarService: SideBarService, public authService: AuthenticationService, private videoService: VideoService,
    private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.sideBarService.change.subscribe(isOpen => {
      this.isOpen = isOpen;
    });

    if (this.authService.isLoggedIn() || this.authService.isGuest()) {
      this.dataService.currentTagsAndCounts.subscribe(data => {
        if (data) {
          this.tagCounts = data;
          for (const key in this.tagCounts) {
            if (!this.tagKeys.hasOwnProperty(key)) {
              this.tagKeys.push(key);
            }
          }
        }
      });
    }

    if (this.authService.isLoggedIn()) {
      this.dataService.currentLibraryCounts.subscribe(data => {
        if (data) {
          this.libraryTypeCounts = data;
          for (const key in this.libraryTypeCounts) {
            if (!this.libraryTypeKeys.hasOwnProperty(key)) {
              this.libraryTypeKeys.push(key);
            }
          }
        }
      });
    }

  }

  navigateToLibrary(libraryType: string) {
    if (libraryType) {
      this.router.navigate(['/video'], { queryParams: { LibraryType: libraryType } });
    }
  }
  navigateToAdmin(adminType: string) {
    if (adminType) {
      this.router.navigate(['/' + adminType]);
    }

  }
  triggerSearch(queryString: Object) {
    if (queryString) {
      this.router.navigate(['/video'], { queryParams: queryString });
    }
  }

}
