import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {podatekWyliczeniaLista, responseAPI} from "../models/faktura-kontraktowca";
import {FormArray} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class FakturyService {

  private readonly _podatekFormLista = new Subject<FormArray>();
  private readonly _fakturaContents = new Subject<podatekWyliczeniaLista>();
  fakturaContents$ = this._fakturaContents.asObservable();
  podatekFormLista$ = this._podatekFormLista.asObservable();

  private url = "http://localhost:4200/faktura"
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Math.floor(Math.random()*10**36)}`
  })

  constructor(
    private _http: HttpClient,
    private toastr: ToastrService
  ) { }

  showSuccess(tekst:string,tytul: string = 'Walidacja') {
    this.toastr.success(tekst, tytul);
  }

  showWarning(tekst:string,tytul: string = 'Walidacja') {
    this.toastr.error(tekst, tytul);
  }

  saveFakturaKontraktowca(body:responseAPI):Observable<any>{
    return this._http.post<string>(`${this.url}/Faktury/fakturaKontraktowca`,body,{headers: this.headers})
  }

  setPodatekLista(lista:FormArray):void{
      this._podatekFormLista.next(lista)
  }

  convertInput(value:number):string{
    return value.toLocaleString('pl-PL',{minimumFractionDigits: 2,maximumFractionDigits: 2})
  }

  convertToFloat(value:string):number{
    let number = value  || '';
    if(typeof number  === 'number'){
      return number;
    }else {
      let transform = parseFloat(number.replace(/\s/g, ''))
      return isNaN(transform) ?  0 : transform
    }
  }
}
