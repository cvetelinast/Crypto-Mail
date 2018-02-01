import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User = require('../classes/user');
import 'rxjs/add/operator/map';

class Email {
  from: string = '';
  description: string = '';
  message: string = '';

  constructor(from: string, description: string, message: string) {
    this.from = from;
    this.description = description;
    this.message = message
  }

}
@Injectable() 
class RequestsService {
  messagesURL: string = 'http://localhost:3000/api/messages';
  usersURL: string = 'http://localhost:3000/api/users';

  emails: Email[];
  headers: Headers;
  options: RequestOptions;

  constructor(private http:Http) { 
    this.emails = [];

    this.headers = new Headers({ 'Content-Type': 'application/json', 
                          'Accept': 'q=0.8;application/json;q=0.9' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  search(userId: string): Observable<Email[]> {
    return this.http.get(this.messagesURL+'/'+ userId).map(res => { 
      return JSON.parse(res.text());
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get(this.usersURL).map(res => { 
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
  recipientName: string = '';
  recipientId: string = '';

  // get from submit form
  recipientEmail: string = '';
  description: string = '';
  message: string = '';

  private loading: boolean = false;
  private emails: Email[];

  constructor(private route: ActivatedRoute, private requestsService: RequestsService) {

    this.id = this.route.snapshot.queryParams['userId'];
    this.email = this.route.snapshot.queryParams['userEmail'];
    this.username = this.route.snapshot.queryParams['username'];
   }

  ngOnInit() {
    this.doSearch();
  }

  sendEmail(){
    this.findUser();
  }

  doSearch() {
    this.loading = true;
    this.requestsService.search(this.id).subscribe( data => {
      this.loading = false;
      this.emails = data;
    }); //.unsubscribe(); - does not work with it
  }

  findUser() {
    this.loading = true;
    this.requestsService.getUsers().subscribe( usersList => {
      for(let u of usersList){
        if(u.email === this.recipientEmail){
          this.recipientName = u.username;
          this.recipientId = u._id;
        }
      }
      this.loading = false;
      this.postAndSendEmail();
    }); // .unsubscribe();
  }

  postAndSendEmail(){
    this.loading = true;
    let body = JSON.stringify({ from: this.username,
      fromEmail: this.email, to: this.recipientName, 
      toEmail: this.recipientEmail, toId: this.recipientId,
      description: this.description, message: this.message
      });
      this.requestsService.postEmail(body).subscribe( data => {
        this.loading = false;
      }); // .unsubscribe();
  }

}