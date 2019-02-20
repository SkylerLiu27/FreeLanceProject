import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { map, catchError, finalize } from 'rxjs/operators';



@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  progressRef: NgProgressRef;
  constructor(private progress: NgProgress) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.progressRef = this.progress.ref();
    this.progressRef.start();

    return next.handle(req)
      .pipe(
        map(event => {
          return event;
        }),

        catchError(error => {
          return throwError(error);
        }),

        finalize(() => {
          this.progressRef.complete();
        })
      );
  }


}
