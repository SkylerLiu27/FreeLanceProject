import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { VideoData, Video } from '../shared/models/video';
import { VideoService } from '../services/video.service';
import { DragScrollComponent } from 'ngx-drag-scroll/lib';
// import { randomBytes } from 'crypto';


// get url from browser
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

// get video services
import { DataService } from '../shared/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../services/authentication.service';
import { UserLogin } from '../shared/models/userLogin';
import { environment } from 'src/environments/environment';
import { debounceTime } from 'rxjs/operators';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  tagsToShow = [];
  videosToShow = [];
  favoriteVideos: VideoData[];
  watchLaterVideos: VideoData[];
  recentlyWatchedVideos: VideoData[];
  recentlyAddedVideos: VideoData[];
  tagCounts = [];
  tagKeys = [];
  @ViewChildren('rcw', { read: DragScrollComponent }) rcw: QueryList<DragScrollComponent>;
  /*
  @ViewChild('fav', { read: DragScrollComponent }) fav: DragScrollComponent;
  @ViewChild('wcl', { read: DragScrollComponent }) wcl: DragScrollComponent;
  @ViewChild('rcw', { read: DragScrollComponent }) rcw: DragScrollComponent;
  @ViewChild('rca', { read: DragScrollComponent }) rca: DragScrollComponent;
  */

  constructor(private videoService: VideoService, public authService: AuthenticationService, private zone: NgZone,
    private dataService: DataService, private _route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    if (!(this.authService.isLoggedIn() || this.authService.isGuest())) {
      this.router.navigate(['/login/']);
    }

    if (this.authService.isLoggedIn() || this.authService.isGuest()) {
      this.dataService.currentTagsAndCounts.subscribe(data => {
        this.tagCounts = data;
        for (const key in this.tagCounts) {
          if (!this.tagKeys.hasOwnProperty(key)) {
            this.tagKeys.push(key);
          }
        }
        if (data) {
          this.getTopNVideos();
          for (const item of this.tagsToShow.sort()) {
            this.videosToShow.push({ tagValue: item['tagValue'], results: [] });
            this.videoService.getAllVideos(item['searchParam']).subscribe(videoType => {
              this.videosToShow.find(x => x.tagValue === item['tagValue']).results = this.updateVideoToshow(videoType.results);
            });
          }
        }
      });

    }
    // this.dataService.videoStateEmitter.subscribe(() => this.videosToShow.map((item) => { this.updateVideoLibraryMarkers(item['results']); }
    //  ));
    // if (this.authService.isLoggedIn()) {
    //   this.dataService.videoStateEmitter.subscribe(() => {
    //     this.getLibraryVideos('favorite');
    //     this.getLibraryVideos('watchLater');
    //     this.getLibraryVideos('recentlyWatched');
    //     this.getLibraryVideos('recentlyAdded');
    //   });
    // }
  }

  // can we do this by passing id?
  moveLeftrcw(item: DragScrollComponent, i) {
    item.moveLeft();
  }
  moveRightrcw(item: DragScrollComponent, i) {
    item.moveRight();
  }

  /*
    moveLeftfav() {
      this.fav.moveLeft();
    }
    moveRightfav() {
      this.fav.moveRight();
    }
    moveLeftwcl() {
      this.wcl.moveLeft();
    }
    moveRightwcl() {
      this.wcl.moveRight();
    }
    moveRightrecw() {
      this.rcw.moveRight();
    }
    moveLeftrca() {
      this.rca.moveLeft();
    }
    moveRightrca() {
      this.rca.moveRight();
    }
    */
  getTopNVideos() {
    const temp = [];
    for (const key in this.tagCounts) {
      if (!temp.includes(this.tagCounts[key])) {
        temp.push(this.tagCounts[key]);
      }
    }
    const topN = Number.parseInt(`${environment.topNTagsToDisplayAtHomeComponent}`);
    const topNumbers = temp.sort().reverse().slice(0, topN);
    let j = 0;
    for (let i = 0; i < topN;) {
      const keyValue = Object.keys(this.tagCounts).filter(k => this.tagCounts[k] === topNumbers[j]);
      for (const item of keyValue) {
        if (i < topN) {
          const searchParams = new Map<string, string>();
          searchParams.set('TagValue', item);
          searchParams.set('TagValue.opp', 'Equal');
          this.tagsToShow.push({ tagValue: item, searchParam: searchParams });
          i++;
        } else {
          break;
        }
      }
      j++;
    }
  }
  getLibraryVideos(libraryType: string) {
    const searchParams = new Map<string, string>();
    searchParams.set('LibraryType', libraryType);
    this.videoService.getAllLibraryVideos(searchParams)
      .subscribe(videos => {
        switch (libraryType) {
          case 'favorite': this.favoriteVideos = this.updateVideoToshow(videos); break;
          case 'watchLater': this.watchLaterVideos = this.updateVideoToshow(videos); break;
          case 'recentlyWatched': this.recentlyWatchedVideos = this.updateVideoToshow(videos); break;
          case 'recentlyAdded': this.recentlyAddedVideos = this.updateVideoToshow(videos); break;
        }
      });
  }

  navToVieoPage(id) {
    // testing
    this.router.navigate(['/video/' + id]);
  }


  updateVideoToshow(videos) {
    if (videos) {
      return videos.map(item => {
        let tempthumbNailJSON = JSON.parse(item.thumbNailJSON);
        if (!tempthumbNailJSON) {
          tempthumbNailJSON = {
            default: 'https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg',
            medium: 'https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg',
            high: 'https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg'
          };
        }
        // console.log(tempthumbNailJSON);
        return {
          ...item,
          thumbNailJSON: {
            default: this.sanitizer.bypassSecurityTrustResourceUrl(tempthumbNailJSON.default),
            medium: this.sanitizer.bypassSecurityTrustResourceUrl(tempthumbNailJSON.medium),
            high: this.sanitizer.bypassSecurityTrustResourceUrl(tempthumbNailJSON.high)

          },
          isFavorite: this.dataService.videoState.favorite.includes(item.videoId),
          isWatchLater: this.dataService.videoState.watchLater.includes(item.videoId),
          isRecentlyWatched: this.dataService.videoState.recentlyWatched.includes(item.videoId)
        };

      });
    }
  }

  // updateVideoLibraryMarkers(videos) {
  //   if (videos) {
  //     return videos.map(item => {
  //       return {
  //         ...item,
  //         isFavorite: this.dataService.videoState.favorite.includes(item.videoId),
  //         isWatchLater: this.dataService.videoState.watchLater.includes(item.videoId),
  //         isRecentlyWatched: this.dataService.videoState.recentlyWatched.includes(item.videoId)
  //       };

  //     });
  //   }
  // }

  saveToLibrary(videoId: string, libraryType: string, tagValue: string) {
    this.videoService.addVideoToLibrary(videoId, libraryType).subscribe(data => {
      switch (libraryType) {
        case 'favorite': this.videosToShow.find(x => x.tagValue === tagValue).results.find(z => z.videoId === videoId).isFavorite = true; break;
        case 'watchLater': this.videosToShow.find(x => x.tagValue === tagValue).results.find(z => z.videoId === videoId).isWatchLater = true; break;
      }
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);
      console.log(this.videosToShow);
    });

  }

  removeFromLibrary(videoId: string, libraryType: string, tagValue: string) {
    this.videoService.deleteVideoFromLibrary(videoId, libraryType).subscribe(data => {
      switch (libraryType) {
        case 'favorite': this.videosToShow.find(x => x.tagValue === tagValue).results.find(z => z.videoId === videoId).isFavorite = false; break;
        case 'watchLater': this.videosToShow.find(x => x.tagValue === tagValue).results.find(z => z.videoId === videoId).isWatchLater = false; break;
      }
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);
     });
  }
}
