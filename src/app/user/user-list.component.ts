import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../shared/models/user';
import { UserService } from '../services/user.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { UtilityHelper } from '../shared/utils/utility';
import { Observable, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { CompanyService } from 'src/app/services/company.service';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ConsoleService } from '@ng-select/ng-select/ng-select/console.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})


export class UserListComponent implements OnInit {

  users: User[];
  usersPagedList: User[];
  searchName: string;
  searchEmail: string;
  searchCompany: string;
  curPage = 1;
  itemsPerPage = 20;
  previousPage: any;
  totalCount: number;
  recordsCountArray: number[];
  selectedRowCount: any;
  actionUser: {
    action: string,
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    phoneArea: string,
    phoneNumber: string,
    email: string,
    company: {
      companyName: string,
      companyId: string,
    },
    role: {
      user: {
        isUser: boolean
        value: number
      },
      admin: {
        isAdmin: boolean
        value: number
      }
    }
  } = {
      action: 'addUser',
      userId: '',
      firstName: '',
      lastName: '',
      userName: '',
      phoneArea: '+1',
      phoneNumber: '',
      email: '',
      company: {
        companyName: '',
        companyId: ''
      },
      role: {
        user: {
          isUser: true,
          value: 2
        },
        admin: {
          isAdmin: false,
          value: 1
        }
      }
    };
  companies: any;
  selectPlaceHolder = { companyName: '', companyId: '' };
  asyncError: any = {
    userName: null,
    email: null
  };

  @ViewChild(NgbPagination) pagination: NgbPagination;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('actionUserMoal') actionUserMoal: ElementRef;
  constructor(private companyService: CompanyService, private userService: UserService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.loadData();
    this.recordsCountArray = new UtilityHelper().getRecordsCount();
    this.companyService.getCompaniesPaged(new Map<any, any>().set('companyName', 'ALl')).subscribe(c => {
      this.companies = c.sort((a, b) => {
        const x = a.companyName.toLowerCase();
        const y = b.companyName.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    });
  }

  compareFn(c1, c2) {
    return c1 && c2 ? c1.companyId === c2.companyId : c1 === c2;
  }

  setUserAction(action: string) {
    this.actionUser.action = action;
  }

  resetActionUser() {
    this.asyncError = {
      userName: null,
      email: null
    };

    this.actionUser = {
      action: '',
      userId: '',
      firstName: '',
      lastName: '',
      userName: '',
      phoneArea: '+1',
      phoneNumber: '',
      email: '',
      company: {
        companyName: '',
        companyId: ''
      },
      role: {
        user: {
          isUser: true,
          value: 2
        },
        admin: {
          isAdmin: false,
          value: 1
        }
      }
    };
  }

  addUser(userForm) {
    this.resetActionUser();
    this.setUserAction('addUser');
    this.setFormElementUnTouched(userForm);
  }
  editUser(user) {
    this.resetActionUser();
    this.setUserAction('editUser');
    this.actionUser.userId = user.userId;
    this.actionUser.firstName = user.person.firstName;
    this.actionUser.lastName = user.person.lastName;
    this.actionUser.userName = user.userName;
    this.actionUser.email = user.person.email;
    this.actionUser.company = user.person;
    this.actionUser.phoneNumber = user.person.phone;
  }


  buttonSwitch() {
    switch (this.actionUser.action) {
      case 'addUser': return 'Add New User'; break;
      case 'editUser': return 'Update'; break;
    }
  }

  loadData() {
    this.userService.getAllUsers()
      .subscribe(
        u => {
          // console.log(u);
          this.users = u.filter(x => x.person != null && x.person.companyName != null);
          this.totalCount = this.users.length;
          this.usersPagedList = [...this.users].slice(0, this.itemsPerPage);
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
    this.usersPagedList = [...this.users].slice(((pageNumber - 1) * rowCount), ((pageNumber - 1) * rowCount) + rowCount);
  }

  onRowCountChange(rowCount: any) {
    this.itemsPerPage = rowCount;
    this.loadPagedData(this.curPage, this.itemsPerPage);
  }

  setFormElementTouched(form: NgForm) {
    if (form) {
      Object.keys(form.controls).map(control => {
        form.controls[control].markAsTouched();
      });
    }
  }
  setFormElementUnTouched(form: NgForm) {
    if (form) {
      Object.keys(form.controls).map(control => {
        form.controls[control].markAsUntouched();
      });
    }
  }

  customRoleValidator({ user, admin }) {
    // console.log(user.isUser || admin.isAdmin);
    return user.isUser || admin.isAdmin;
  }

  customCompanyValidator({ companyId }) {
    // console.log(companyId !== '');
    return companyId !== '';
  }

  createNewUserObj(actionUser) {
    const newUser = {
      userName: actionUser.userName,
      id: actionUser.userId,
      person: {
        firstName: actionUser.firstName,
        lastName: actionUser.lastName,
        email: actionUser.email,
        phone: actionUser.phoneNumber,
        companyId: actionUser.company.companyId
      },
      roles: [actionUser.role.admin.isAdmin ? actionUser.role.admin.value : 0
        , actionUser.role.user.isUser ? actionUser.role.user.value : 0].reduce((acc, cur) => {
          if (cur) {
            acc.push(cur);
          }
          return acc;
        }, [])
    };
    return newUser;
  }

  // customAsyncValidator(){
  //   return !Object.keys(this.asyncError).some(key=>{
  //     if(this.asyncError[key]){
  //       return true
  //     }
  //   })
  // }
  // test(){
  //   alert('test');
  // }

  onSubmit(form: NgForm) {
    // console.log(form.controls['company'])
    if (form && (form.invalid || !this.customCompanyValidator(this.actionUser.company) || !this.customRoleValidator(this.actionUser.role))) {
      this.setFormElementTouched(form);
    } else {
      const newUser = this.createNewUserObj(this.actionUser);
      switch (this.actionUser.action) {
        case 'addUser':
          console.log('add');
          this.userService.saveUser(newUser)
            .subscribe(val => {
              this.closeModal();
              this.loadData();
              // console.log('post is successful: ', val)
              this.resetActionUser();
              this.setFormElementUnTouched(form);
            }, err => {
              this.asyncError.userName = err['UserName'] ? err['UserName'][0] : null;
              this.asyncError.email = err['Person.Email'] ? err['Person.Email'] : null;

            }); break;
        case 'editUser':
            newUser.id =
          this.userService.updateUser(newUser).subscribe(val => {
            console.log(val), err => {
              console.log(err);
            };
          });
          return 'Update'; break;
      }

    }




  }


  closeModal() {
    this.closeBtn.nativeElement.click();
  }

  formatter = (x: { companyName: string, companyId: string }) => x.companyName;


  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2 ? [] : this.companyService.getCompaniesPaged(new Map<any, any>().set('companyName', term)).pipe(map(x => {
          // console.log(typeof term);
          return x.filter(company => company.companyName.toLowerCase().includes(term.toLowerCase())).map(company => company.companyName);
          // return x;
        }),
          catchError(() => {
            return of([]);
          })),
      )
    );
  }

  resetPassword(userId: string) {
    this.authService.resetPassword(userId).subscribe(data => console.log(data));
  }

  deactivateUser(userId: string) {

  }
}
