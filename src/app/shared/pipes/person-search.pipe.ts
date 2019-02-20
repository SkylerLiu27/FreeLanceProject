import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'personSearch'
})
export class PersonSearchPipe implements PipeTransform {

  transform(items: User[], nameSearch: string, emailSearch: string, companySearch: string) {

    if (items && items.length) {
      return items.filter(item => {
        if ((nameSearch && item.person.lastName.toLowerCase().indexOf(nameSearch.toLowerCase()) === -1) &&
        (nameSearch && item.person.firstName.toLowerCase().indexOf(nameSearch.toLowerCase()) === -1)) {
          return false;
        }
        if (emailSearch && item.person.email.toLowerCase().indexOf(emailSearch.toLowerCase()) === -1) {
          return false;
        }
        if (companySearch && item.person.companyName.toLowerCase().indexOf(companySearch.toLowerCase()) === -1) {
          return false;
        }
        return true;
      });
    } else {
      return items;
    }
  }

}
