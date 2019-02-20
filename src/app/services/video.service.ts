import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { Video, VideoData } from '../shared/models/video';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { PagedResults } from '../shared/models/pagedResults';
import { RequestMoreInfo } from '../shared/models/request-more-info';

@Injectable({
  providedIn: 'root'
})
export class VideoService {


  constructor(private apiService: ApiService, private httpClient: HttpClient) { }

  getTopVideos(): Observable<Video[]> {
    return this.apiService.getAll('/assets/videos.json');
  }

  getVideoById(searchParams?: any): Observable<Video> {
    if (searchParams) {
      return this.apiService.getOne('video', searchParams.value.id)
        .pipe(
          map(response => {
            return response as Video;
          }), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
        );
    }

  }

  getAllVideos(searchParams?: Map<any, any>, isGlobalSearch = false): Observable<PagedResults<Video>> {
    if (isGlobalSearch) {
      return this.apiService.getPagedResults('globalsearch', searchParams) // this.httpClient.get('http://localhost:4200/assets/videos.json')
        .pipe(
          map(response => {
            //console.log('getAllvideos')
            return response as PagedResults<Video>
          }), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
        );
    } else {
      return this.apiService.getPagedResults('video', searchParams) // this.httpClient.get('http://localhost:4200/assets/videos.json')
        .pipe(
          map(response => {
            return response as PagedResults<Video>
          }), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
        );
    }
  }
  getAllLibraryVideos(searchParams?: Map<any, any>): Observable<Video[]> {
    // console.log('ingetAlllibaryVideos, the librarytype is ' + searchParams.get('LibraryType'));
    return this.apiService.getAll('videolibrary/' + searchParams.get('LibraryType'))
      .pipe(
        map(response => {
          //console.log(response[0]);
          return response as Video[]
        }), catchError(e => throwError(new Error('UMMMM: LIBRARY VIDEOS ERRORS')))
      );
  }

  // getAllTags(): Observable<string[]> {
  //   return this.httpClient.get('http://localhost:4200/assets/testtags.json')
  //     .pipe(
  //       map(response => response as string[]), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
  //     );
  // }

  // getAllVideosDummy(searchParams?: Map<any, any>): Observable<Video[]> {
  //   return this.httpClient.get('http://localhost:4200/assets/videos.json')
  //     .pipe(
  //       map(response => response as Video[]), catchError(e => throwError(new Error('Yee')))
  //     );
  // }
  deleteVideoFromLibrary(videoId: string, libraryType: string): Observable<any> {
    const obj = {};
    obj[videoId] = libraryType;
    return this.apiService.delete('videolibrary/', obj)
      .pipe(
        map(response => response as any), catchError(e => throwError(new Error(e)))
      );
  }

  addVideoToLibrary(videoId: string, libraryType: string): Observable<any> {
    const obj = {};
    obj[videoId] = libraryType;
    return this.apiService.create('videolibrary/', obj)
      .pipe(
        map(response => response as any), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
      );
  }

  getLibraryAndCounts(): Observable<any> {
    return this.apiService.getAll('videolibrary/count')
      .pipe(
        map(response => response as any), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
      );
  }

  getTagsAndCounts(): Observable<any> {
    return this.apiService.getAll('tag/count')
      .pipe(
        map(response => {
          return response as any;
        }), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
      );
  }

  requestMoreInfo(reqMoreInfoData: RequestMoreInfo): Observable<RequestMoreInfo> {
    return this.apiService.create('video/requestinfo', reqMoreInfoData)
    .pipe(
      map(response => response as any), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
    );

  }
}

// API call according to the passed value of type

