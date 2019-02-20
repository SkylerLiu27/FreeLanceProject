import { Component, OnInit } from '@angular/core';
import { SideBarService } from '../services/side-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  tagCounts = [];
  tagKeys = [];
  selectedTags: Array<string>;
  showDetails: boolean;

  constructor(private sideBarService: SideBarService, public authService: AuthenticationService, private dataService: DataService,
    private router: Router, private activatedRoute: ActivatedRoute) {
  }
  onClickMe() {
    this.sideBarService.toggle();
  }

  ngOnInit() {
    // this.showDetails = false;
    if (this.authService.isLoggedIn() || this.authService.isGuest()) {
      this.getAllTags();
    }
  }

  signout() {
    this.sideBarService.isOpen = false;
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    this.router.navigate(['/login/']);
  }

  signin() {
    localStorage.removeItem('isGuest');
    this.router.navigate(['/login/']);
  }

  hideAdvancedSearch() {
    this.showDetails = !this.showDetails;
  }

  populateControls() {
    // let queryParams = new Map<String, String>();

    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    for (const key of queryParams.keys) {
      switch (key.toLocaleLowerCase()) {
        case 'title': const titleControl = <HTMLInputElement>document.getElementById('searchTitleCtrl');
          titleControl.value = queryParams.get(key); break;
        case 'description': const descriptionControl = <HTMLInputElement>document.getElementById('searchDescCtrl');
          descriptionControl.value = queryParams.get(key); break;
        case 'tagvalue': const TagList = queryParams.get(key).split(',');
          for (const item of TagList) {
            this.selectedTags.push(item);
          }
          break;
        case 'publisheddate': break;
      }
    }
  }
  getAllTags() {
    this.selectedTags = new Array<string>();
    this.dataService.currentTagsAndCounts
      .subscribe(data => {
        this.tagCounts = data;
        for (const key in this.tagCounts) {
          if (!this.tagKeys.hasOwnProperty(key)) {
            this.tagKeys.push(key);
          }
        }
      });
  }

  addTag(item) {
    const selectedTag = item as string;
    this.selectedTags.push(selectedTag);
  }

  removeTag(item) {
    const selectedTag = item as string;
    const index = this.selectedTags.indexOf(selectedTag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    }
  }

  triggerSearch(queryString: Object) {
    if (Object.keys(queryString).length > 0 && queryString.constructor === Object) {
      this.showDetails = !this.showDetails;
      this.router.navigate(['/video'], { queryParams: queryString });
      this.selectedTags = [];
    }
  }


}

