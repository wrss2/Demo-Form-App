import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface CatFactsResponse {
  data: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CatsService {
  private apiUrl = 'https://meowfacts.herokuapp.com/';
  constructor(private http: HttpClient) { }
  getCatFacts(count: number): Observable<CatFactsResponse> {
    return this.http.get<CatFactsResponse>(`${this.apiUrl}?count=${count}`);
  }
}
