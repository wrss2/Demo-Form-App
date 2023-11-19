import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {FakturyService} from "../../../services/faktury.service";

@Component({
  selector: 'app-sekcja-dat',
  templateUrl: './sekcja-dat.component.html',
  styleUrls: ['./sekcja-dat.component.scss']
})
export class SekcjaDatComponent implements OnInit {

  @Input() fakturaKontraktowca!:FormGroup;

  constructor(
    private fb: FormBuilder,
    private fakturyService: FakturyService,
  ) { }

  ngOnInit(): void {
  }

}
