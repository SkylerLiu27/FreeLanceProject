import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { RequestMoreInfo } from '../models/request-more-info';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VideoService } from 'src/app/services/video.service';
import { ModalDirective } from 'ngx-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-request-more-info',
  templateUrl: './request-more-info.component.html',
  styleUrls: ['./request-more-info.component.scss']
})
export class RequestMoreInfoComponent implements OnInit {
  requestMoreInfo = new RequestMoreInfo();
  userData: User;
  loggedInUser = false;
  @Input('video') video: any;
  @Input('isSuccess') isSuccess: boolean;
  @Input('isError') isError: boolean;
  @Input('message') message: string;

  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(private authService: AuthenticationService, private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loggedInUser = true;
      this.userService.getUserById(this.authService.UserId).subscribe(data => { this.userData = data;
        this.requestMoreInfo.person = this.userData.person;
      });
    }
  }

  onSubmit() {
    this.requestMoreInfo.videoId = this.video.videoId;
    this.requestMoreInfo.videoURL = this.video.videoUrl['changingThisBreaksApplicationSecurity'];
    this.requestMoreInfo.asGuest = this.authService.isGuest();
    this.requestMoreInfo.person.userId = this.authService.UserId;
    console.log(this.requestMoreInfo);
    this.videoService.requestMoreInfo(this.requestMoreInfo).subscribe(data => { this.isSuccess = true; console.log('More Information Request is Successful'); this.closeModal(); },
       (error) => { this.isError = false;  console.log(error); }
      );
  }

  closeModal() {
    this.closeBtn.nativeElement.click();
  }
}
