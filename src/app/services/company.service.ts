import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PagedResults } from '../shared/models/pagedResults';
import { Company } from '../shared/models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService) { }

  getCompaniesPaged(searchParams?: Map<any, any>): Observable<PagedResults<Company>> {
    return this.apiService.getPagedResults('company', searchParams);
  }
  getAllCompanies(): Observable<Company[]> {
    return this.apiService.getAll('company');

  }

  saveCompany(company: Company): Observable<Company> {
    return this.apiService.create('company', company);
  }
}
