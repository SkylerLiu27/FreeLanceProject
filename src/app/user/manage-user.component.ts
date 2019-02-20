import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError, filter } from 'rxjs/operators';
import { Company } from 'src/app/shared/models/company';
import { PagedResults } from 'src/app/shared/models/pagedResults';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit, AfterViewChecked {
  pageTitle: string;
  userId: string;
  user: User;
  testString: PagedResults<Company>;
  companyNameList: String[];
  public model: Company[];
  company: Company;
  constructor(private userService: UserService, private companyService: CompanyService,
    private cdRef: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = new User();
    this.route.paramMap.subscribe(params => {
      this.userId = params['id'];
      if (this.userId != null) {
        this.pageTitle = 'Manage User';
        this.userService.getUserById(this.userId)
          .subscribe(val => this.user = val);
      } else {
        this.pageTitle = 'Add User';
      }
    });
  }

  selectedItem(item) {
    this.company = item.item as Company;
    this.user.person.companyId = this.company.companyId;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onSubmit(form: NgForm) {
    this.userService.saveUser(this.user)
      .subscribe(val => console.log('post is successful: ', val));
  }
  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2 ? [] : this.companyService.getCompaniesPaged(new Map<any, any>().set('companyName', term)).pipe(map(x => {
          // console.log(typeof term);
          return x.filter(company => company.companyName.toLowerCase().includes(term.toLowerCase()));
          // return x;
        }),
          catchError(() => {
            return of([]);
          })),
      )
    );
  }

  formatter = (x: { companyName: string, companyId: string }) => x.companyName;
}
