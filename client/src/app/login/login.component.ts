import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JsonpModule, Jsonp } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import User = require('../classes/user');
import 'rxjs/add/operator/map';

@Injectable()
class RequestsService {
  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    });
    this.options = new RequestOptions({ headers: this.headers });
  }

  getUser(apiRequest: string): Observable<User> {
    return this.http.get(apiRequest).map(res => {
      return JSON.parse(res.text());
    });
  }

  getUsers(apiRequest: string): Observable<any> {
    return this.http.get(apiRequest).map(res => {
      return JSON.parse(res.text());
    });
  }

  postUser(user: User, apiReqest: string): Observable<any> {
    let body = JSON.stringify(user);
    return this.http.post(apiReqest, body, this.options);
  }

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [RequestsService]
})

export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  repeatPassword: string = '';
  email: string = '';
  action: string;
  apiPost: string = 'http://localhost:3000/api/users';
  apiGet: string = '';
  apiGetToPost: string = '';
  private loading: boolean = false;

  constructor(private requestsService: RequestsService, private router: Router) {
  }

  ngOnInit() {
    this.action = "Login";
    this.loginTab();
  }

  navigateToMainComponent(user: User) {
    let id = user._id;
    let email = user.email;
    let name = user.username;
    this.router.navigate(['main'], { queryParams: { userId: id, userEmail: email, username: name }, skipLocationChange: true });
  }

  click() {
    if (this.action === "Login") {
      this.login();
    } else if (this.action === "Register") {
      this.register();
    }
  }

  login() {
    if (this.validateUsername() && this.validatePassword()) {
      let item = new User(this.username, this.password, '', '');
      this.findUserAndLogIn();
    }
  }

  register() {
    if (this.validateUsername() && this.validatePassword()
      && this.validateSecondPassword() && this.validateEmail()) {
      let item = new User(this.username, this.password, this.email, '');
      this.findExistingUserOrRegister();
    }
  }

  findExistingUserOrRegister() {
    this.loading = true;
    this.apiGetToPost = `http://localhost:3000/api/users/${this.username}/${this.email}`;
    this.requestsService.getUsers(this.apiGetToPost).subscribe(response => {
      if (response.length > 0) {
        this.showUsernameValidationPopup();
        this.showEmailValidationPopup();
        return;
      }
      let user = new User(this.username, this.password, this.email, '');
      this.requestsService.postUser(user, this.apiPost).subscribe(data => {
        this.loading = false;
        this.showModalForFinishedRegistration();
      });
    }); // .unsubscribe();
  }

  findUserAndLogIn() {
    this.loading = true;
    this.apiGet = `http://localhost:3000/api/user/${this.username}/${this.password}`;
    this.requestsService.getUser(this.apiGet).subscribe(user => {
      if (user !== null) {
        this.navigateToMainComponent(user);
      } else {
        this.showUsernameValidationPopup();
      }
    }
    ); // .unsubscribe();
  }

  validateUsername(): boolean {
    if (this.username.length === 0 || this.username.indexOf(' ') >= 0) {
      this.showUsernameValidationPopup();
      return false;
    }
    return true;
  }
  showUsernameValidationPopup(): void {
    const popupName = document.getElementById('myPopupName');
    popupName.classList.toggle('show');
    setTimeout(function () { popupName.classList.toggle('show'); }, 2000);
  }
  validatePassword(): boolean {
    if (this.password.length === 0) {
      const popupPass = document.getElementById('myPopupPass');
      popupPass.classList.toggle('show');
      setTimeout(function () { popupPass.classList.toggle('show'); }, 2000);
      return false;
    }
    return true;
  }
  validateSecondPassword(): boolean {
    if (this.password !== this.repeatPassword) {
      const popupPassRepeat = document.getElementById('myPopupPassRepeat');
      popupPassRepeat.classList.toggle('show');
      setTimeout(function () { popupPassRepeat.classList.toggle('show'); }, 2000);
      return false;
    }
    return true;
  }
  validateEmail(): boolean {
    const re = /\S+@\S+\.\S+/;
    if (this.email.length === 0 || !re.test(this.email)) {
      this.showEmailValidationPopup();
      return false;
    }
    return true;
  }
  showEmailValidationPopup(): void {
    const popupEmail = document.getElementById('myPopupEmail');
    popupEmail.classList.toggle('show');
    setTimeout(function () { popupEmail.classList.toggle('show'); }, 2000);
  }

  loginTab() {
    const hidereg = document.getElementsByClassName('hidden');
    if (hidereg.length > 0) {
      hidereg[0].setAttribute('style', 'visibility: hidden');
    }
    this.action = "Login";

  }
  registerTab() {
    const hidelog = document.getElementsByClassName('hidden');
    if (hidelog.length > 0) {
      hidelog[0].setAttribute('style', 'visibility: visible');
    }
    this.action = "Register";
  }

  showModalForFinishedRegistration() {
    var modal = document.getElementById('modal');
    var overlay = document.getElementById('overlay');
    modal.setAttribute('style', 'visibility: visible');
    overlay.setAttribute('style', 'visibility: visible');
    modal.classList.add("modal");
    overlay.classList.add("overlay");
    setTimeout(function () {
      modal.classList.remove("modal");
      overlay.classList.remove("overlay");
    }, 1500);
  }

}
