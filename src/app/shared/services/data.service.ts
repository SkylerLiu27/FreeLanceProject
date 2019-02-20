import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private libraryCountsSubject = new BehaviorSubject(null);
  currentLibraryCounts = this.libraryCountsSubject.asObservable();
  private tagsAndCountsSubject = new BehaviorSubject(null);
  currentTagsAndCounts = this.tagsAndCountsSubject.asObservable();
  videoState: {
    favorite: string[],
    watchLater: string[],
    recentlyWatched: string[],
    recentlyAdded: string[]
  };
  videoStateEmitter;

  constructor(private videoService: VideoService, private authService: AuthenticationService, private apiService: ApiService) {
    this.videoStateEmitter = new EventEmitter();
    this.videoState = {
      favorite: [],
      watchLater: [],
      recentlyWatched: [],
      recentlyAdded: []
    };

    if (this.tagsAndCountsSubject.value === null) {
      this.updateTagsAndCounts();
    }
    if (this.libraryCountsSubject.value === null && this.authService.isLoggedIn()) {
      this.updateLibraryCounts();
      this.getVideoIdArrayFromLibraryType('favorite');
      this.getVideoIdArrayFromLibraryType('watchLater');
      this.getVideoIdArrayFromLibraryType('recentlyWatched');
      this.getVideoIdArrayFromLibraryType('recentlyAdded');
    }
  }

  getVideoIdArrayFromLibraryType(type: string) {
    this.apiService.getAll('videolibrary/' + type).subscribe(res => {
      this.videoState[type] = res.map(item => item.videoId);
      this.videoStateEmitter.emit(this.videoState);
    });
  }


  updateTagsAndCounts() {
    this.videoService.getTagsAndCounts().subscribe(x => {
      this.tagsAndCountsSubject.next(x);
    });
  }

  updateLibraryCounts() {
    this.videoService.getLibraryAndCounts().subscribe(x => this.libraryCountsSubject.next(x));
  }
}
