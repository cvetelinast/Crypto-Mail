import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JsonpModule, Jsonp } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

class SearchItem {
  username: string
  password: string
  email: string

  constructor(username: string,
              password: string,
              email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}

@Injectable() 
class SearchService {
  apiURL:string = 'http://localhost:3000/api/users';
  results:SearchItem[];

  constructor(private http:Http) { 
    this.results = [];
  }

  search(user: SearchItem) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(this.apiURL)
        .toPromise()
        .then(
          res => { // Success
            this.results = JSON.parse(res.text());
            resolve([user, this.results]);
            },
            msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }
}


@Injectable() 
class PostService {
  apiURL:string = 'http://localhost:3000/api/users';
  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json', 
                                 'Accept': 'q=0.8;application/json;q=0.9' });
    this.options = new RequestOptions({ headers: this.headers });
}

postUser(user: SearchItem): Promise<any> {
  console.log(user);
  let body = JSON.stringify(user);
  console.log(body); 
  let promise = new Promise((resolve, reject) => {
    this.http
    .post(this.apiURL, body, this.options)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  });
  return promise;
}

  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }

  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
  }

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SearchService, PostService]
})

export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  email: string = '';
  users: SearchItem[] = [];
  constructor(private usersList: SearchService, 
              private router: Router, 
              private postService : PostService) {
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

  testRouting(){
    console.log("routing btn");
    this.router.navigate(['home']);
  }

  login(){
    let item = new SearchItem(this.username, this.password, this.email);
    this.usersList.search(item)
        .then(this.findUser)
        .then(() => this.testRouting())
        .catch(error => console.log(error));    
  }

  register(){
    
     if(this.password !== document.getElementsByTagName("input")[4].value) {
       console.log("Wrong password");
       return;
     }
     let item = new SearchItem(this.username, this.password, this.email);

     this.usersList.search(item)
          .then(this.checkIfUserExistForRegister)
          .then(this.postUserHelper)
          .catch(error => console.log(error));
  }

  postUserHelper(item){
    this.postService.postUser(item); // TypeError: Cannot read property 
                                     // 'postService' of undefined
                                     // at LoginComponent.postUserHelper 
                                     // (login.component.ts:164)
  }

  checkIfUserExistForRegister(results){
    let promise = new Promise((resolve, reject) => {
      let item = results[0];
      let usersList = results[1];

      for(let u of usersList){
        if(u.username === item.username
         && u.password === item.password){
           reject();
         }
      }
      resolve(item);
    });
    return promise;
  }

  findUser(results){
    let item = results[0];
    let usersList = results[1];
    for(let u of usersList){
     if(u.username === item.username
      && u.password === item.password){
        this.testRouting(); // this is from another context, 
                            // we can't access it testRouting() from here
      }
    }
  }
  
}
