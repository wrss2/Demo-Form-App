import {FormControl, FormGroup} from "@angular/forms";


export class FakturaFormControl extends FormControl {
  label:string;
  nameInput:string;

  constructor(label:string,nameInput:string,value:any,validator:any) {
    super(value,validator);
    this.label = label;
    this.nameInput = nameInput;
  }

}

export interface User {
  username?: string;
  password?: string;
}


export class FakturaFormGroup extends FormGroup {

  constructor() {
    super({});

  }

}
