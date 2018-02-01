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
  apiURL: string = 'http://localhost:3000/api/users';
  results: User[];
  headers: Headers;
  options: RequestOptions;

  constructor(private http:Http) { 
    this.results = [];

    this.headers = new Headers({ 'Content-Type': 'application/json', 
                          'Accept': 'q=0.8;application/json;q=0.9' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  getUsers(): Observable<User[]> {
    return this.http.get(this.apiURL).map(res => { 
          return JSON.parse(res.text());
    });
  }

postUser(user: User): Observable<any> {
  let body = JSON.stringify(user);
  console.log(body);
  debugger;
  return this.http.post(this.apiURL, body, this.options);
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
  email: string = '';
  users: User[] = [];
  private loading: boolean = false;

  constructor(private requestsService: RequestsService, private router: Router) {
  }

  ngOnInit() {
    this.loginTab();
  }
  loginTab(){
    console.log("login");
    this.hideRegisterTab();
    const log = document.getElementsByClassName('login');
    if (log.length > 0){
      log[0].setAttribute("style","visibility: visible");
    }
  }
  hideLoginTab(){
    const hidelog = document.getElementsByClassName('login');
    if (hidelog.length > 0){
      hidelog[0].setAttribute("style","visibility: hidden");
    }
  }
  registerTab(){
    console.log("register");
    this.hideLoginTab();
    const reg = document.getElementsByClassName('register');
    if (reg.length > 0){
      reg[0].setAttribute("style","visibility: visible");
    }
  }
  hideRegisterTab(){
    const hidereg = document.getElementsByClassName('register');
    if (hidereg.length > 0){
      hidereg[0].setAttribute("style","visibility: hidden");
    }
  }

  testRouting(user : User){
    let id = user._id;
    let email = user.email;
    let name = user.username;
    this.router.navigate(['main'], { queryParams: { userId : id , userEmail: email, username: name }, skipLocationChange: true });
  }

  login(){
    let item = new User(this.username, this.password, "", "");
    this.findUserAndLogIn();
  }

  register(){

     if(this.password !== document.getElementsByTagName("input")[4].value) {
       console.log("Wrong password");
       return;
     }
     let item = new User(this.username, this.password, this.email, "");
     this.findExistingUserOrRegister();
  }

findExistingUserOrRegister() {
    this.loading = true;
    this.requestsService.getUsers().subscribe( usersList => {
      for(let u of usersList){
        if(u.username === this.username
          || u.password === this.password){
            return;
        }
      }
    }); // .unsubscribe();
    let user = new User(this.username, this.password, this.email, "");
    this.requestsService.postUser(user).subscribe( data => {
      this.loading = false;
    });;
  }

  findUserAndLogIn() {
    this.loading = true;
    this.requestsService.getUsers().subscribe( usersList => {
      for(let u of usersList){
        if(u.username === this.username
          && u.password === this.password){
            this.testRouting(u);
        }
      }
    }); // .unsubscribe();
  }

}
