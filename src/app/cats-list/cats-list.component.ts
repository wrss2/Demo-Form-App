import {Component, HostListener, OnInit} from '@angular/core';
import {concat, concatMap, distinct, finalize, map, Observable, tap} from "rxjs";
import {CatsService} from "../services/cats.service";

@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrls: ['./cats-list.component.scss']
})
export class CatsListComponent implements OnInit {

  numberOfFacts = 20;
  loading = false;
  catFacts: string[] = [];
 constructor(private catsService: CatsService) { }

  onScroll(event:Event): void {
    if(event.type ==='scroll') {
      let cat_facts = document.getElementsByClassName("cats-facts")[0] as HTMLElement
      let cat_facts_scrollHeight = cat_facts.scrollHeight
      let cat_facts_offsetHeight = cat_facts.offsetHeight
      let cat_facts_clientHeight = cat_facts.clientHeight
      let cat_facts_scrollTop = cat_facts.scrollTop
      let scrollBottom = cat_facts_scrollTop + Math.max(cat_facts_clientHeight, cat_facts_offsetHeight)

      if (scrollBottom + 1000 >= cat_facts_scrollHeight && !this.loading) {
        this.loadCatFacts();
      }
    }
  }

  ngOnInit(): void {
    this.loadCatFacts();
  }
  loadCatFacts() {
    this.loading = true;
    this.catsService.getCatFacts(this.numberOfFacts).pipe(
      map(data => data.data),
      distinct(cataText => cataText),
    ).subscribe((data) => {
      this.catFacts = [...new Set(this.catFacts.concat(data))];
      this.loading = false;
      console.log("Liczba faktów", this.catFacts.length)
    });
  }




}
