import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { PagedResults } from '../shared/models/pagedResults';


// You can use pipes to link operators together. Pipes let you combine multiple functions into a single function.
// tslint:disable-next-line:max-line-length
// The pipe() function takes as its arguments the functions you want to combine, and returns a new function that, when executed, runs the composed functions in sequence

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(protected http: HttpClient) { }

  getAll(path: string, searchParams?: Map<any, any>): Observable<any[]> {
    let params = new HttpParams();
    if (searchParams) {
      searchParams.forEach((value: string, key: string) => {
        params = params.append(key, value);
      });
    }
    // console.log(`${environment.api_url}${path}`);
    // console.log(params);
    return this.http.get(`${environment.api_url}${path}`, { params: params })
      .pipe
      (
      map(response => response as any[]), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
      );
  }

  getPagedResults(path: string, searchParams?: Map<any, any>): Observable<PagedResults<any>> {
    let params = new HttpParams();
    if (searchParams) {
      searchParams.forEach((value: string, key: string) => {
        params = params.append(key, value);
      });
    }
    return this.http.get(`${environment.api_url}${path}`, { params: params })
      .pipe
      (
      map(response => {
        // console.log(response)
        return response as PagedResults<any>;
      }), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
      );
  }
  getOne(path: string, id: string): Observable<any> {
    return this.http.get(`${environment.api_url}${path}` + '/' + id)
      .pipe(
        map(response => response), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED')))
      );
  }
  create(path: string, resource: Object = {}, options?): Observable<any> {
    return this.http.post(`${environment.api_url}${path}`, resource, options)
      .pipe(catchError(error => {
        if (error.status === 400) {
          return throwError(error.error);
        }
        return throwError(new Error('SOMETHING BAD HAPPENED'));
      }));
  }
  getAPI(path: string, options?): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, options)
      .pipe(map(response => response), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED'))));
  }
  update(path: string, resource): Observable<any> {
    return this.http.put(`${environment.api_url}${path}` + '/' + resource.id, JSON.stringify({ isRead: true }))
      .pipe(map(response => response), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED'))));
  }

  // delete(path: string, id: string) {
  //   return this.http.delete(`${environment.api_url}${path}` + '/' + id)
  //     .pipe(map(response => response), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED'))));
  // }
  delete(path: string, resource: Object = {}): Observable<any> {
    return this.http.request('delete', `${environment.api_url}${path}`, { body: resource }).pipe(map(response => response), catchError(e => throwError(new Error(e))));
    return this.http.delete(`${environment.api_url}${path}`, resource)
      .pipe(map(response => response), catchError(e => throwError(new Error('SOMETHING BAD HAPPENED'))));
  }
  // private handleError(error: Response) {
  //   if (error.status === 400) { return observableThrowError(new BadInputError(error.json())); }
  //   if (error.status === 404) { return observableThrowError(new NotFoundError()); }
  //   if (error.status === 500) { return observableThrowError(new AppError()); }
  //   return observableThrowError(new AppError(error));
  // }
}
