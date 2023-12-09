import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime, distinctUntilChanged, endWith, filter, finalize,
  fromEvent,
  map,
  scan,
  Subscription,
  switchMap,
  tap,
  throwError
} from "rxjs";
import {CatsService} from "../services/cats.service";



@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrls: ['./cats-list.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CatsListComponent implements OnInit {

  @ViewChild('scrollContainer', {read: ElementRef, static: false}) scrollContainer!: ElementRef<HTMLElement>;
  numberOfFacts = 20;

  catsSubject = new BehaviorSubject([]);
  catsFactsObservable$ = this.catsSubject.asObservable()

  loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable()


  catsFactsCombined$ = this.catsFactsObservable$.pipe(
    switchMap(() => this.catsService.getCatFacts(this.numberOfFacts)),
    map((data)=> data.data),
    scan<string[], string[]>((accumulatedFacts, newFacts) => [...new Set(    [...accumulatedFacts,...newFacts])], []),
    tap(() =>   this.loadingSubject.next(false)),
    catchError(err => {
      console.log('Error', err);
      return throwError(err);
    })
  );

  // onScroll(event:Event): void {
  //   if(event.type ==='scroll') {
  //     let cat_facts = document.getElementsByClassName("cats-facts")[0] as HTMLElement
  //     let cat_facts_scrollHeight = cat_facts.scrollHeight
  //     let cat_facts_offsetHeight = cat_facts.offsetHeight
  //     let cat_facts_clientHeight = cat_facts.clientHeight
  //     let cat_facts_scrollTop = cat_facts.scrollTop
  //     let scrollBottom = cat_facts_scrollTop + Math.max(cat_facts_clientHeight, cat_facts_offsetHeight)
  //
  //     if (scrollBottom + 500 >= cat_facts_scrollHeight && !this.loadingSubject.value) {
  //      this.loadCatFacts();
  //     }
  //   }
  // }

   constructor(
      private catsService: CatsService,
   ) {
   }

  ngOnInit(): void {
    this.loadCatFacts();
  }
  loadCatFacts() {
    this.loadingSubject.next(true)
    this.catsSubject.next([]);
  }

}
