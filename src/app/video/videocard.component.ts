import { Component, OnInit, Input } from '@angular/core';
import { VideoData } from 'src/app/shared/models/video';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-videocard',
  templateUrl: './videocard.component.html',
  styleUrls: ['./videocard.component.scss']
})
export class VideocardComponent implements OnInit {
  @Input() v: VideoData;

  constructor(private router: Router, private videoService: VideoService, private dataService: DataService) { }

  ngOnInit() {
  }

  navToVieoPage() {
    this.router.navigate(['/video/' + this.v.videoId]);
  }
  saveToLibrary(videoId: string, libraryType: string) {
    this.videoService.addVideoToLibrary(videoId, libraryType).subscribe(data => {
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);

    });
  }

  removeFromLibrary(videoId: string, libraryType: string) {
    this.videoService.deleteVideoFromLibrary(videoId, libraryType).subscribe(data => {
      this.dataService.updateLibraryCounts();
      this.dataService.getVideoIdArrayFromLibraryType(libraryType);
    });
  }

}
