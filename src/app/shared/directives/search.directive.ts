import { Directive, HostListener, ElementRef, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { OperationType } from '../constants/enums';
import { SearchCriteria } from '../models/search-criteria';

@Directive({
  selector: '[appSearch]'
})
export class SearchDirective implements OnInit {

  constructor(private el: ElementRef) { }
  @Input() columnName: string;
  @Input() operationType: OperationType;
  @Input() searchType: string;
  @Input() selectedTags: string;
  @Output() searchTriggered = new EventEmitter<Object>();
  // @HostBinding() dataType: string;
  queryString: Object;
  searchCriteriaList = new Array<SearchCriteria>();

  @HostListener('keyup.enter', ['$event.target'])
  @HostListener('click', ['$event.target'])
  onclick(btn) {
    this.clearSearch();
    if (this.searchType === 'AdvancedSearch') {
      if (btn.type === 'submit') {
        this.getSearchCriteriaFromAdvancedSearch();
      }
    } else if (this.searchType === 'LeftNavigationTagSearch') {
      this.getSearchCriteriaFromLeftNav();
    } else if (this.searchType === 'GlobalSearch') {
      // if (btn.type === 'submit') {
        this.getSearchCriteriaFromGlobalSearch();
      // }
    }
    this.triggerSearch(this.queryString);
  }
  clearSearch() {
    this.queryString = '';
    this.searchCriteriaList = new Array<SearchCriteria>();
  }
  ngOnInit() {
  }
  triggerSearch(queryString: Object) {
    this.searchTriggered.emit(queryString);
  }

  getSearchCriteriaFromGlobalSearch() {
    if (this.el.nativeElement.children[0].value) {
      // for (const item of this.columnName.split(',')) {
      //   const sc = new SearchCriteria();
      //   sc.fieldName = item;
      //   sc.value = this.el.nativeElement.children[0].value;
      //   sc.opp = this.operationType;
      //   this.searchCriteriaList.push(sc);
      // }
      const searchCriteria = new SearchCriteria();
      searchCriteria.fieldName = this.columnName;
      searchCriteria.value = this.el.nativeElement.children[0].value;
      this.searchCriteriaList.push(searchCriteria);
    }
    this.getQueryString(this.searchCriteriaList);
  }
  getSearchCriteriaFromLeftNav() {
    const searchCriteria = new SearchCriteria();
    searchCriteria.fieldName = this.columnName;
    searchCriteria.value = this.el.nativeElement.children[0].innerHTML;
    searchCriteria.opp = this.operationType;
    this.searchCriteriaList.push(searchCriteria);
    this.getQueryString(this.searchCriteriaList);
  }
  getSearchCriteriaFromAdvancedSearch() {

    const titleControl = <HTMLInputElement>document.getElementById('searchTitleCtrl');
    if (titleControl.value.length > 0) {
      const sc = new SearchCriteria();
      sc.fieldName = 'Title';
      sc.value = titleControl.value;
      sc.opp = OperationType.Like;
      this.searchCriteriaList.push(sc);
    }

    const descriptionControl = <HTMLInputElement>document.getElementById('searchDescCtrl');
    if (descriptionControl.value.length > 0) {
      const sc = new SearchCriteria();
      sc.fieldName = 'Description';
      sc.value = descriptionControl.value;
      sc.opp = OperationType.Like;
      this.searchCriteriaList.push(sc);
    }

    const tagsControl = <HTMLInputElement>document.getElementById('searchTagsCtrl');
    if (this.selectedTags) {
      const sc = new SearchCriteria();
      sc.fieldName = 'TagValue';
      sc.value = this.selectedTags;
      sc.opp = OperationType.In;
      this.searchCriteriaList.push(sc);
    }

    const fromDateControl = <HTMLInputElement>document.getElementById('searchFromDateCtrl');
    const toDateControl = <HTMLInputElement>document.getElementById('searchToDateCtrl');
    if (fromDateControl.value.length > 0 && toDateControl.value.length > 0) {
      const sc = new SearchCriteria();
      sc.fieldName = 'PublishedDate';
      sc.value = fromDateControl.value + ',' + toDateControl.value;
      sc.opp = OperationType.InBetween;
      this.searchCriteriaList.push(sc);
    } else if (fromDateControl.value.length > 0) {
      const sc = new SearchCriteria();
      sc.fieldName = 'PublishedDate';
      sc.value = fromDateControl.value;
      sc.opp = OperationType.GreaterThanOrEqual;
      this.searchCriteriaList.push(sc);
    } else if (toDateControl.value.length > 0) {
      const sc = new SearchCriteria();
      sc.fieldName = 'PublishedDate';
      sc.value = toDateControl.value;
      sc.opp = OperationType.LessThanOrEqual;
      this.searchCriteriaList.push(sc);
    }
    this.getQueryString(this.searchCriteriaList);
  }

  getQueryString(searchCriteriaList: SearchCriteria[]) {
    this.queryString = new Object();
    for (const searchCriteria of searchCriteriaList) {
      for (const [key, value] of Object.entries(searchCriteria)) {
        switch (key) {
          case 'value': this.queryString[searchCriteria['fieldName']] = value; break;
          case 'opp': this.queryString[searchCriteria['fieldName'] + '.opp'] = isNaN(value) ? value : OperationType[value]; break;
          default: break;
        }
      }
    }
    // this.queryString = this.queryString.substring(0, this.queryString.length - 1);
    console.log(this.queryString);
  }
}
