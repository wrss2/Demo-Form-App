import {AfterViewInit, ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit {
  title = 'Faktury';
  isLogin$


  constructor(
    private authService:AuthService,
    private router:Router
  ) {
    this.isLogin$ = this.authService.isLogin$
  }

  ngOnInit(){
    //  this.isLogin$.subscribe(data => {console.log("isLogin", data)})

  }

  logout(){
    this.authService.logout()
    this.router.navigateByUrl('/login')
  }

  protected readonly sessionStorage = sessionStorage;
}
