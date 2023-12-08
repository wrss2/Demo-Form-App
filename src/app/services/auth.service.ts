import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "../models/faktura-form-control";

@Injectable({
  providedIn:'root'
})
export class AuthService {

  isLoginSubject$ = new BehaviorSubject<boolean>(false)
  isLogin$ = this.isLoginSubject$.asObservable()

  users = [
    {
      id: 1,
      username: "root",
      password: "test"
    },
    {
      id: 2,
      username: "admin",
      password: "secret"
    },
  ]
  session: User = {};
  constructor() {
    let isLogin = sessionStorage.getItem('isLogin') === "true" ? true : false
    this.isLoginSubject$.next(isLogin)
  }

  login(username: string, password: string) {
    let user = this.users.find((user) => user.username === username && user.password === password)
    if (user) {
      this.session = user
      sessionStorage.setItem("session", JSON.stringify(this.session))
      sessionStorage.setItem("isLogin", 'true')
      this.isLoginSubject$.next(true);
    }

    return user;
  }

  logout(){
    this.session = {};
    sessionStorage.clear()
    this.isLoginSubject$.next(false);
  }

}
