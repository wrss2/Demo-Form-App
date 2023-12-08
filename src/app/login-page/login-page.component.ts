import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {

  loginForm:FormGroup = this.fb.group({
    username:['', Validators.required],
    password:['', Validators.required],
  })
  constructor(
    private authServce:AuthService,
    private fb:FormBuilder,
    private  router:Router
  ) { }

  ngOnInit(): void {
  }


  login(){
    let user = this.authServce.login(
      this.loginForm.get("username")?.value,
      this.loginForm.get("password")?.value,
    );


    if(user){
      sessionStorage.setItem('isLogin',"true")
      this.authServce.isLoginSubject$.next(true)
      this.router.navigateByUrl('/faktura')
    }
  }

}
