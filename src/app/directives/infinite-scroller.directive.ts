import {Directive, AfterViewInit, ElementRef, Input, ViewChild} from '@angular/core';
import {BehaviorSubject, filter, fromEvent, map} from "rxjs";

@Directive({
  selector: '[InfiniteScroller]'
})
export class InfiniteScrollerDirective implements AfterViewInit {

  @Input() data$:BehaviorSubject<any> = new BehaviorSubject<any>([]);
  @Input() loading$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit() {
    fromEvent(this.element.nativeElement, 'scroll')
      .pipe(
        map(() => this.element.nativeElement),
        filter(() => this.isScrolledToBottom()),
      ).subscribe(()=>{
        this.loadData()
    })
  }
  isScrolledToBottom(): boolean {
    const element = this.element.nativeElement;
    let scrollBottom = element.scrollTop + Math.max(element.clientHeight, element.offsetHeight)
    if(scrollBottom  >= element.scrollHeight && !this.loading$.value) {
      return true
    }
    return false
  }
  loadData(){
    this.loading$.next(true)
    this.data$.next([])
  }

}
