import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JsonpModule, Jsonp } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
//import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

class SearchItem {
  constructor(public id: string,
              public username: string,
              public password: string,
              public email: string) {
  }
}
/*
@Injectable()
class SearchService {
  apiRoot: string = 'http://localhost:3000/api/users';
  results: SearchItem[];

  constructor(private jsonp: Jsonp) {
    this.results = [];
  }

  search() {
    return new Promise((resolve, reject) => {
      this.results = [];
      this.jsonp.request( 'http://localhost:3000/api/users')
          .toPromise()
          .then(
              res => { // Success
                this.results = res.json().results.map(item => {
                  return new SearchItem(
                    item.id,
                    item.username,
                    item.password,
                    item.email
                  );
                });
                resolve();
              },
              msg => { // Error
                reject(msg);
              }
          );
    });
  }
}

*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  name: String = '';
  password: String = '';
  email: String = '';
  users: SearchItem[] = [];
  constructor(private http: Http, private router: Router) {
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
    //this.router.navigateByUrl['home'];
  }

  login(){
    // this.name = document.getElementsByTagName("input")[0].value;
    // this.password = document.getElementsByTagName("input")[1].value;
    // const s = this.getUsers();
    // console.log(s);
  }
  register(){
    // this.password = document.getElementsByTagName("input")[3].value;
    // if(this.password !== document.getElementsByTagName("input")[4].value) {
    //   console.log("Wrong password");
    // }
    // this.name = document.getElementsByTagName("input")[2].value;
    // this.email = document.getElementsByTagName("input")[4].value;
  }
  func(){
    console.log("func");
    // this.name = document.getElementsByTagName("input")[0].value;
    // this.password = document.getElementsByTagName("input")[1].value;
     console.log(this.name);
     console.log(this.password);
    // this.users = this.http.get('http://localhost:3000/api/users')
    // .subscribe((data) => { console.log(JSON.parse(data.text()))});

   // this.search();

  }
  search(): Observable<SearchItem[]> {
     return this.http.get('http://localhost:3000/api/users') 
          .map(res => {
            //return 
            let res1 = res.json().results.map(item => {
              let sItem =  new SearchItem(
                  item.id,
                  item.username,
                  item.password,
                  item.email
              );
              this.users.push(sItem);
             /* if(sItem.username===this.name && sItem.password===this.password){
                console.log("YEYYYY");
              }*/
            });
          return res1;
          });
    }
     
    //   this.users = this.http.get('http://localhost:3000/api/users')
    //   .map((res:Response) => (
    //     res.json() //Convert response to JSON
    // ))
    // .subscribe(data => {console.log(data)});
    
 
//       for (var key in this.users) {
//         if (this.users.hasOwnProperty(key)) {
//           var element = this.users[key];
//           console.log(element);
//         }
//       }
     
//   }
// //  https://codecraft.tv/courses/angular/http/http-with-observables/
// //  search(term:string): Observable<SearchItem[]> { .. }

//   getUsers(){
//    // return this.http.get('http://localhost:3000/api/users')
//      //       .map(res=>res.json);
//   }
}
