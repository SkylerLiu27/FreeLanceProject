import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../shared/models/user';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  getUserById(id: string): Observable<User> {
    return this.apiService.getOne('/user', id)
      .pipe(
        map(response => response as User), catchError(e => throwError(new Error(e)))
      );
  }

  saveUser(user: any): Observable<User> {
    return this.apiService.create('/user', user);
  }

  updateUser(user:any): Observable<User> {
    return this.apiService.update('/user', user);
  }

  getAllUsers(): Observable<User[]> {
    return this.apiService.getAll('user');

  }




}
