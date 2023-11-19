import {ChangeDetectorRef, Injector, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {FakturyService} from "../services/faktury.service";
import {debounceTime, delay, distinctUntilChanged, map, Observable, of, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Pipe({
  name: 'localeString',
  pure:true
})
export class LocaleStringPipe implements PipeTransform{

  transValue?: string;
  constructor(
    private fakturyService:FakturyService,
    private _ref: ChangeDetectorRef
  ) {
  }

  transform(value: any): Observable<string> {
     return of(value).pipe(
        debounceTime(3000),
        delay(1500),
        map((transformedText) =>  {
          let checkVal = transformedText;
          if(checkVal === '' || checkVal === null ||  /[!\D]+/gm.test(checkVal)){
            checkVal = 0
          } else{
            checkVal = parseFloat(checkVal)
          }
          let transValue = this.fakturyService.convertInput(checkVal)
      //    this._ref.markForCheck()
         return transValue
      })
    )

  }


}
