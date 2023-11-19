import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {

  @Input() form!:FormGroup;
  @Input() fg!:FormGroup;
  @Input() formCN!:string;
  @Input() placeholder!:string;
  @Input() typ!:string;

  constructor() {}

  ngOnInit(): void {
  }

}
