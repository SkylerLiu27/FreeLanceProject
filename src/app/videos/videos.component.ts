import { Component, OnInit } from '@angular/core';
import { stringify } from '@angular/core/src/render3/util';
import { Video } from '../shared/models/video';

// get url from browser
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';


// piping
import { filter, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

// get video services
import { VideoService } from '../services/video.service';
import { DataService } from '../shared/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  // obj = JSON.parse('{"virtualCount":1, "results":[{"youtubeVideoId":"nE_MDm7cvvg","archivedFlag":null, "privateFlag":false, "title": "September 27, 2018", "description":"This is a test video. Testing on Youtube API Only.","publishedDateTime":"2018-09-27T17:00:00","videoId":"8aef51a8-5254-4379-aeb9-4fac5dc9a81b","thumbNailJSON":"thumbnails":{"default":{"url":"https://i.ytimg.com/vi/rj7xMBxd5iY/default.jpg"},"medium":{"url":"https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg","high":{"url":"https://i.ytimg.com/vi/rj7xMBxd5iY/hqdefault.jpg"}}","tags":[]}]}');
  // tslint:disable-next-line:max-line-length
  // obj1 = JSON.parse('{"virtualCount": 1,"results": [{"youtubeVideoId": "nE_MDm7cvvg","archivedFlag": null,"privateFlag": false,"title": "September 27, 2018","description": "This is a test video. Testing on Youtube API Only.","publishedDateTime": "2018-09-27T17:00:00","videoId": "8aef51a8-5254-4379-aeb9-4fac5dc9a81b","thumbNail": ["https://i.ytimg.com/vi/rj7xMBxd5iY/default.jpg", "https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg", "https://i.ytimg.com/vi/rj7xMBxd5iY/hqdefault.jpg"],"tags": []}]}');
  // tslint:disable-next-line:max-line-length
  obj3 = JSON.parse('{"virtualCount": 1,"results": [{"youtubeVideoId": "nE_MDm7cvvg","archivedFlag": null,"privateFlag": false,"title": "this is a dummy title that you will never forget in your life","description": "This is a test video. Testing on Youtube API Only.","publishedDateTime": "2018-09-27T17:00:00", "videoId": "8aef51a8-5254-4379-aeb9-4fac5dc9a81b", "thumbNailJSON" : {"default":"https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg","medium":"https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg","high":"https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg"},"tags": []}]}');
  // tslint:disable-next-line:max-line-length
  // obj2 = JSON.parse('"thumbNailJSON": "\r\n \"thumbnails\": {\"default\": {\"url\": \"https://i.ytimg.com/vi/rj7xMBxd5iY/default.jpg\"},\"medium\": {\"url\": \"https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg\",\"high\": {\"url\": \"https://i.ytimg.com/vi/rj7xMBxd5iY/hqdefault.jpg\"}}"');
  videos: Video[];
  videosToShow: any[];
  videoCategory: string;
  constructor(private videoService: VideoService, private dataService: DataService,
    private _route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {

  }
  ngOnInit() {
    // console.log(this.dataService.currentLibraryCounts.subscribe());
    // console.log('testing: ' + this.obj.results.thumbNailJSON);
    // console.log('testing' + this.obj3.results[0].thumbNail);
    this.dataService.videoStateEmitter.subscribe(newState => {
      this.updateVideoToshow();
    });
    if (this._route.snapshot.queryParamMap.has('LibraryType') === true) {
      this.getLibraryVideos(this.parseQString());
    } else {
      this.getVideos(this.parseQString());
    }

    this._route.queryParams
      .subscribe(
        queryParams => {
          if (queryParams.TagValue) {
            this.videoCategory = queryParams.TagValue;
          }

          if (queryParams.LibraryType) {
            this.videoCategory = queryParams.LibraryType;
          }
        }
      );
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      debounceTime(500)
    )
      .subscribe((event: NavigationEnd) => {
        if (this._route.snapshot.queryParamMap.has('LibraryType') === true) {
          // console.log('LibraryType!!');
          // call getlibraryVideos
          this.getLibraryVideos(this.parseQString());
        } else {
          this.getVideos(this.parseQString());
        }
      });
  }
  getVideos(searchParams: Map<string, string>): void {
    if (searchParams) {
      this.videoService.getAllVideos(searchParams, searchParams.has('term') ? true : false)
        .subscribe(videos => {
          this.videos = videos.results;
          this.updateVideoToshow();
        }
        );
    } else {

    }
  }

  updateVideoToshow() {
    if (this.videos) {
      this.videosToShow = this.videos.map(item => {
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

  getLibraryVideos(searchParams: Map<string, string>): void {
    // console.log('inGetLibraryVideos()');
    if (searchParams) {
      this.videoService.getAllLibraryVideos(searchParams)
        .subscribe(videos => {
          this.videos = videos;
          this.updateVideoToshow();
        });
    } else {
      console.log('searchParams are null');
    }
  }
  parseQString(): Map<string, string> {
    const params = new Map<string, string>();
    // console.log("printing");
    const keys: string[] = this._route.snapshot.queryParamMap.keys;
    keys.forEach((k: string) => {
      // console.log("key = " + k);
      const v = this._route.snapshot.queryParamMap.get(k);
      // console.log("value = " + v);
      params.set(k, v);
    });
    params.forEach((value: string, key: string) => {
      // console.log('key is ' + key + ', value is ' + value);
    });
    return params;
  }

  saveToLibrary(videoId: string, libraryType: string) {
    this.videoService.deleteVideoFromLibrary(videoId, libraryType).subscribe(data => {
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);

    });
  }
}
