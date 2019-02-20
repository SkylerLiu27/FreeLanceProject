import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigOauthComponent } from './config-oauth.component';

describe('ConfigOauthComponent', () => {
  let component: ConfigOauthComponent;
  let fixture: ComponentFixture<ConfigOauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigOauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
