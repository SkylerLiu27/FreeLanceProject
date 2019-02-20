import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { Company } from '../shared/models/company';
import { UtilityHelper } from '../shared/utils/utility';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  company = new Company();
  companies: Company[];
  recordsCountArray: number[];
  selectedRowCount: any;
  companiesPagedList: Company[];
  searchString: string;
  curPage = 1;
  itemsPerPage = 20;
  previousPage: any;
  totalCount: number;
  @ViewChild(NgbPagination) pagination: NgbPagination;

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.loadData();
    this.recordsCountArray = new UtilityHelper().getRecordsCount();

  }
  loadData() {
    this.companyService.getAllCompanies()
      .subscribe(
        c => {
          this.companies = c;
          this.totalCount = this.companies.length;
          this.companiesPagedList = [...this.companies].slice(0, this.itemsPerPage);

        }
      );
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.curPage = page;
      this.loadPagedData(page, this.itemsPerPage);
    }
  }

  loadPagedData(pageNumber: number, rowCount: number) {
    this.companiesPagedList = [...this.companies].slice(((pageNumber - 1) * rowCount), ((pageNumber - 1) * rowCount) + rowCount);
  }

  onKeyUpEnter(searchTerm, rowCount: number) {
    if (searchTerm.length > 0) {
      this.companiesPagedList = this.companies.filter(c => {
        return c.companyName.toLowerCase().includes(this.searchString.toLowerCase());
      }
      );
      this.totalCount = this.companiesPagedList.length;
    } else {
      this.companiesPagedList = this.companies.slice(0, this.itemsPerPage);
      this.totalCount = this.companies.length;
    }

  }
  onRowCountChange(rowCount: any) {
    this.itemsPerPage = rowCount;
    this.loadPagedData(this.curPage, this.itemsPerPage);

  }

  onSubmit() {
    this.companyService.saveCompany(this.company).subscribe(data => { this.company = new Company(); this.loadData(); });
  }
}


