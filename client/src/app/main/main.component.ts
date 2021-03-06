import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User = require('../classes/user');
import Cipher = require('../classes/cipher');
import Email = require('../classes/email');
import 'rxjs/add/operator/map';

@Injectable()
class RequestsService {
  messagesURL: string = 'http://localhost:3000/api/messages';
  usersURL: string = 'http://localhost:3000/api/users/username';
  emails: Email[];
  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {
    this.emails = [];

    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    });
    this.options = new RequestOptions({ headers: this.headers });
  }

  search(userId: string): Observable<Email[]> {
    return this.http.get(this.messagesURL + '/' + userId).map(res => {
      return JSON.parse(res.text());
    });
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get(this.usersURL + '/' + username).map(res => {
      return JSON.parse(res.text());
    });
  }

  postEmail(body: string): Observable<any> {
    return this.http.post(this.messagesURL, body, this.options);
  }

}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [RequestsService]
})
export class MainComponent implements OnInit {
  // get from router from LoginComponent
  id: string = '';
  email: string = '';
  username: string = '';

  // get from getRequest from 'http://localhost:3000/api/users'
  recipientEmail: string = '';
  recipientId: string = '';

  // get from submit form
  recipientName: string = '';
  description: string = '';
  message: string = '';

  private loading: boolean = false;
  private emails: Email[];

  constructor(private route: ActivatedRoute, private requestsService: RequestsService, private router: Router) {

    this.id = this.route.snapshot.queryParams['userId'];
    this.email = this.route.snapshot.queryParams['userEmail'];
    this.username = this.route.snapshot.queryParams['username'];
  }

  ngOnInit() {
    this.doSearch();
  }

  sendEmail() {
    if (this.validateRecipientName && this.validateDescription) {
      this.findUser();
    }
  }

  doSearch() {
    this.loading = true;
    this.requestsService.search(this.id).subscribe(data => {
      this.loading = false;
      let cipher = new Cipher();
      data.forEach(email => { email.message = cipher.decode(email.message); });
      this.emails = data;
    }); //.unsubscribe();
  }

  findUser() {
    this.loading = true;
    this.requestsService.getUserByUsername(this.recipientName).subscribe(user => {
      debugger;
      if (user == null) {
        this.showPopup();
        return;
      }
      this.recipientEmail = user.email;
      this.recipientId = user._id;
      this.loading = false;
      this.postAndSendEmail();
    }); // .unsubscribe();
  }

  postAndSendEmail() {
    this.loading = true;
    let cipher = new Cipher();
    let encodedMessage = cipher.encode(this.message);
    let body = JSON.stringify({
      from: this.username,
      fromEmail: this.email, to: this.recipientName,
      toEmail: this.recipientEmail, toId: this.recipientId,
      description: this.description, message: encodedMessage
    });
    this.requestsService.postEmail(body).subscribe(data => {
      this.loading = false;
      this.finishSending();
    }); // .unsubscribe();
  }

  finishSending() {
    this.recipientName = '';
    this.description = '';
    this.message = '';
    this.showModalForFinishedSending();
  }

  showModalForFinishedSending() {
    var modal = document.getElementById('modal');
    var overlay = document.getElementById('overlay');
    modal.setAttribute('style', 'visibility: visible');
    overlay.setAttribute('style', 'visibility: visible');
    setTimeout(function () {
      modal.setAttribute('style', 'visibility: hidden');
      overlay.setAttribute('style', 'visibility: hidden');
    }, 1500);
  }

  validateRecipientName(): boolean {
    if (this.recipientName.length === 0 || this.recipientName.indexOf(' ') >= 0
      || this.username === this.recipientName) {
      this.showPopup();
      return false;
    }
    return true;
  }
  showPopup() {
    const popup = document.getElementById('myPopupName');
    popup.classList.toggle('show');
    setTimeout(function () { popup.classList.toggle('show'); }, 2000);
  }

  validateDescription(): boolean {
    if (this.description.length === 0) {
      const popup = document.getElementById('myPopupDescription');
      popup.classList.toggle('show');
      setTimeout(function () { popup.classList.toggle('show'); }, 2000);
      return false;
    }
    return true;
  }
  logout(){
    this.router.navigate(['login']);
  }

}