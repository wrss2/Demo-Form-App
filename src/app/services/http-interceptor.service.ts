import { Injectable } from '@angular/core';
import {HttpInterceptor} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService  implements HttpInterceptor{

  constructor() { }

  intercept(req, next) {
    console.log("req", req)
    console.log("next", next)
    return next.handle(req);
  }
}
