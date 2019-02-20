import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './shared/components/about.component';
import { ContactUsComponent } from './shared/components/contact-us.component';
import { NotFoundComponent } from './shared/components/not-found.component';
import { CreateAccountComponent } from './account/create-account.component';
import { FooterComponent } from './shared/layout/footer.component';
import { UserListComponent } from './user/user-list.component';
import { ManageUserComponent } from './user/manage-user.component';
import { HeaderComponent } from './shared/layout/header.component';
import { SidenavComponent } from './shared/layout/sidenav.component';
import { CompanyListComponent } from './company/company-list.component';
import { ManageCompanyComponent } from './company/manage-company.component';

// third-party imports
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import { CarouselModule } from 'ngx-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { NgProgressModule } from '@ngx-progressbar/core';
import { LoaderInterceptor } from './shared/interceptors/loader-interceptor';
import { HttpTokenInterceptor} from './shared/interceptors/http-token-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchDirective } from './shared/directives/search.directive';
import { DragScrollModule } from 'ngx-drag-scroll';
import { VideoComponent } from './video/video.component';
import { VideosComponent } from './videos/videos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PersonSearchPipe } from './shared/pipes/person-search.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { VideocardComponent } from './video/videocard.component';
import { ConfigOauthComponent } from './login/config-oauth.component';
import { AuthenticationGuardService } from './shared/services/authentication-guard.service';
import { AdminGuardService } from './shared/services/admin-guard.service';
import { RequestMoreInfoComponent } from './shared/components/request-more-info.component';
import { ResetPasswordComponent } from './account/reset-password.component';
import { MustMatchDirective } from './shared/directives/must-match.directive';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AboutComponent,
    ContactUsComponent,
    NotFoundComponent,
    CreateAccountComponent,
    FooterComponent,
    UserListComponent,
    ManageUserComponent,
    HeaderComponent,
    SidenavComponent,
    CompanyListComponent,
    ManageCompanyComponent,
    VideoComponent,
    SearchDirective,
    VideosComponent,
    PersonSearchPipe,
    VideocardComponent,
    ConfigOauthComponent,
    RequestMoreInfoComponent,
    ResetPasswordComponent,
    MustMatchDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragScrollModule,
    NgxPaginationModule,
    NgProgressModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost']
      }
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contactus', component: ContactUsComponent },
      { path: 'companies', component: CompanyListComponent, canActivate: [AdminGuardService] },
      { path: 'company', component: ManageCompanyComponent, canActivate: [AdminGuardService]},
      { path: 'config', component: ConfigOauthComponent, canActivate: [AdminGuardService]},
      { path: 'account/create', component: CreateAccountComponent, canActivate: [AdminGuardService] },
      { path: 'user', component: ManageUserComponent, canActivate: [AdminGuardService] },
      { path: 'users', component: UserListComponent, canActivate: [AdminGuardService] },
      { path: 'user/:id', component: ManageUserComponent },
      { path: 'video', component: VideosComponent },
      { path: 'requestmoreinfo', component: RequestMoreInfoComponent },
      { path: 'video/:id', component: VideoComponent },
      { path: 'resetpassword', component: ResetPasswordComponent},
      { path: '**', component: NotFoundComponent }
    ]),
    FlexLayoutModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    CarouselModule.forRoot(),
    NgbModule,
    NgSelectModule,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}

