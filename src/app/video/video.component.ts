import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Video, VideoData } from '../shared/models/video';
import { VideoService } from '../services/video.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../shared/services/data.service';
import { AuthenticationService } from '../services/authentication.service';
import { SideBarService } from '../shared/services/side-bar.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DragScrollComponent } from 'ngx-drag-scroll/lib';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  video;
  isSuccess = false;
  isError = false;
  message: string;
  relatedVideos: VideoData[];
  relatedVideos2: any[];
  @ViewChildren('rcw', { read: DragScrollComponent }) rcw: QueryList<DragScrollComponent>;

  constructor(private videoService: VideoService, private router: Router, private _route: ActivatedRoute,
    private dataService: DataService, private sanitizer: DomSanitizer, public authService: AuthenticationService,
    private sideBarService: SideBarService) { }

  ngOnInit() {
    if (this.sideBarService.isOpen === true) {
      this.sideBarService.toggle();
    }
    this._route.params.subscribe(
      params => {
        this.videoService.getVideoById(this._route.params).subscribe((res) => {
          this.video = res;
          this.video.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.video.youtubeVideoId}?autoplay=1&rel=0`);
          if (this.authService.isLoggedIn()) {
            this.saveToLibrary(res.videoId, 'recentlyWatched');
          }

          const searchParams = new Map<string, string>();
          searchParams.set('TagValue', this.video.tags[0].tagValues[0]);
          searchParams.set('TagValue.opp', 'Equal');
          this.videoService.getAllVideos(searchParams, false)
            .subscribe(videos => {
              this.relatedVideos = this.updateVideoToshow(videos);
            }
            );

        });
      }
    );
  }

   // can we do this by passing id?
   moveLeftrcw(item: DragScrollComponent, i) {
    item.moveLeft();
  }
  moveRightrcw(item: DragScrollComponent, i) {
    item.moveRight();
  }
  navToVieoPage(videoId) {
    this.router.navigate(['/video/' + videoId]);
  }
  updateVideoToshow(videos) {
    if (videos) {
      return videos.results.map(item => {
        let tempthumbNailJSON = JSON.parse(item.thumbNailJSON);
        if (!tempthumbNailJSON) {
          tempthumbNailJSON = {
            default: 'https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg',
            medium: 'https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg',
            high: 'https://i.ytimg.com/vi/rj7xMBxd5iY/mqdefault.jpg'
          };
        }
        return {
          ...item,
          thumbNailJSON: {
            default: this.sanitizer.bypassSecurityTrustResourceUrl(tempthumbNailJSON.default),
            medium: this.sanitizer.bypassSecurityTrustResourceUrl(tempthumbNailJSON.medium),
            high: this.sanitizer.bypassSecurityTrustResourceUrl(tempthumbNailJSON.high)

          },
        };

      });
    }
  }

  saveToLibrary(videoId: string, libraryType: string) {
    this.videoService.addVideoToLibrary(videoId, libraryType).subscribe(data => {
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);
      this.videoService.getVideoById().subscribe((res) => {
        this.video = res;
      });

    });
  }

  removeFromLibrary(videoId: string, libraryType: string) {
    this.videoService.deleteVideoFromLibrary(videoId, libraryType).subscribe(data => {
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);
      this.videoService.getVideoById().subscribe((res) => {
        this.video = res;
      });

    });
  }

}