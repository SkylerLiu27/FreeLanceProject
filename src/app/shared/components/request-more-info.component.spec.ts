import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMoreInfoComponent } from './request-more-info.component';

describe('RequestMoreInfoComponent', () => {
  let component: RequestMoreInfoComponent;
  let fixture: ComponentFixture<RequestMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestMoreInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
