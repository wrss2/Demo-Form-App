import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, FormGroupDirective, NgForm,
  ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {FakturyService} from "../../../services/faktury.service";
import {debounceTime, distinctUntilChanged, map, Observable, of} from "rxjs";
import {podatekWyliczeniaLista, stawkaVAT} from "../../../models/faktura-kontraktowca"
import {MatSelectChange} from "@angular/material/select";
import {ErrorStateMatcher} from "@angular/material/core";
import {FakturaFormControl} from "../../../models/faktura-form-control";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sekcja-stawki-vat',
  templateUrl: './sekcja-stawki-vat.component.html',
  styleUrls: ['./sekcja-stawki-vat.component.scss']
})
export class SekcjaStawkiVATComponent implements OnInit {

  @Input() dataSource!: MatTableDataSource<AbstractControl>;
  @Input() fakturaKontraktowca!: FormGroup;
  @Output() validFormStatus = new EventEmitter<boolean>();

  matcher = new CustomErrorStateMatcher();

  get podatekFormLista(): FormArray {
    return (this.fakturaKontraktowca.get('podatekFormLista') as FormArray);
  }

  readonly PODATEK_23: number = 0.23
  readonly PODATEK_8: number = 0.08
  readonly PODATEK_5: number = 0.05
  readonly PODATEK_4: number = 0.04

  stawkiVAT: stawkaVAT[] = [
    {value: 'zw', viewValue: 'ZW'},
    {value: this.PODATEK_23, viewValue: '23%'},
    {value: this.PODATEK_8, viewValue: '8%'},
    {value: this.PODATEK_5, viewValue: '5%'},
    {value: this.PODATEK_4, viewValue: '4%'},
  ];
  displayedColumns: string[] = ['stawkaVAT', 'kwotaNetto', 'kwotaVAT', 'kwotaBrutto', 'removeRowButton'];

  alwaysMatcher = {errorStateMatcher: {isErrorState: () => true}};
  limitSumyTotal = 2000000;
  limitWyswietlWarning = false;

  constructor(
    private fb: FormBuilder,
    private fakturyService: FakturyService,
  ) {
  }

  ngOnInit(): void {
    this.statusFormCheck()
    this.wyliczanieFormularza()
  }


  sumaKwota(kwotaRodzaj: string) {
    const suma = this.podatekFormLista.controls
      .map(control => control.get(kwotaRodzaj)?.value)
      .reduce((acc, value) => acc + (this.fakturyService.convertToFloat(value) || 0), 0)
    this.fakturaKontraktowca.get(`${kwotaRodzaj}Suma`)?.setValue(this.fakturyService.convertInput(suma), {emitEvent: false});
    if (kwotaRodzaj == "kwotaBrutto") {
      if (suma > this.limitSumyTotal) {
        let limitWyswietl = this.fakturyService.convertInput(this.limitSumyTotal)
        this.limitWyswietlWarning = true;
        this.fakturaKontraktowca.setErrors({'valid':false})
        this.fakturyService.showWarning(`Suma brutto wszystkich kwot powyżej ${limitWyswietl}`)
      } else if(suma < 0) {
        this.limitWyswietlWarning = true;
        this.fakturaKontraktowca.setErrors(null)
        this.fakturaKontraktowca.setErrors({'valid':false})
        this.fakturyService.showWarning(`Suma brutto nie może być ujemna`)
      }else {
        this.limitWyswietlWarning = false;
        this.fakturaKontraktowca.setErrors(null)
      }
    }
  }

  customValidator(name: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let controlForm = control["_parent"]
      console.log("control",control)

      if (controlForm) {
        let stawkaVAT = this.fakturyService.convertToFloat(controlForm.get("stawkaVAT")?.value)
        let kwotaNetto = this.fakturyService.convertToFloat(controlForm.get("kwotaNetto")?.value)
        let kwotaBrutto = this.fakturyService.convertToFloat(controlForm.get("kwotaBrutto")?.value)
        let kwotaVAT = this.fakturyService.convertToFloat(controlForm.get("kwotaVAT")?.value)
        let fraction = parseFloat((kwotaVAT / kwotaNetto).toFixed(2))

        if ((kwotaBrutto - kwotaNetto) !== kwotaVAT) {
          controlForm.get("kwotaBrutto")?.setErrors({'incorrect': true, 'valid': false});
          controlForm.get("kwotaBrutto").markAllAsTouched()
          if (name == "kwotaBrutto") {
            controlForm.get("kwotaBrutto").markAllAsTouched()
            return {'incorrect': true, 'valid': false}
          }
        }

        if (kwotaNetto > 0) {
          if (fraction !== stawkaVAT) {
            controlForm.get("kwotaVAT")?.setErrors({'incorrect': true, 'valid': false});
            controlForm.get("kwotaVAT").markAllAsTouched()
              if (name == "kwotaVAT") {
              controlForm.get("kwotaVAT").markAllAsTouched()
              return {'incorrect': true, 'valid': false}
            }
          }
        }
      }

      return null;
    }
  }

  onAddRow() {
    let podatekForm = this.fb.group({
      "stawkaVAT": new FakturaFormControl('Stawka VAT',"stawkaVAT",null , Validators.required),
      "kwotaNetto":new FakturaFormControl('Kwota netto',"kwotaNetto",this.fakturyService.convertInput(0) , [Validators.required,this.customValidator('kwotaNetto')]),
      "kwotaVAT":new FakturaFormControl('Kwota VAT',"kwotaVAT",this.fakturyService.convertInput(0) , [Validators.required,this.customValidator('kwotaVAT')]),
      "kwotaBrutto":new FakturaFormControl('Kwota Brutto',"kwotaBrutto",this.fakturyService.convertInput(0) , [Validators.required,this.customValidator('kwotaBrutto')])
    }, {updateOn: 'change'})

    this.podatekFormLista.push(podatekForm)
    this.dataSource = new MatTableDataSource(this.podatekFormLista.controls)
    console.log("form", this.fakturaKontraktowca)
  }

  onRemoveRow(index: number): void {
    if (index >= 0) {
      let data = this.dataSource.data;
      data.splice(index, 1);
      this.podatekFormLista.value.splice(index, 1)
      this.dataSource = new MatTableDataSource(data);
      this.fakturyService.setPodatekLista(this.podatekFormLista)
      this.multiSumaKolumn()
    }
  }

  focusIn(val: FormControl): void {
    let transValue: string;
    if (val.value) {
      const floatValue = this.fakturyService.convertToFloat(val.value);
      if (floatValue === 0) {
        transValue = '';
      } else {
        transValue = floatValue.toString();
      }
    } else {
      transValue = '';
    }
    val.setValue(transValue, {emitEvent: false})
  }


  focusOut(val: FormControl): void {
    let checkVal = val.value;
    if (checkVal === '' || checkVal === null || /[^\d-]+/gm.test(checkVal)) {
      checkVal = 0
    } else {
      checkVal = parseFloat(checkVal)
    }
    let transValue = this.fakturyService.convertInput(checkVal)
    val.setValue(transValue, {emitEvent: false})
  }


  statusFormCheck() {
    // zgadzać iloczyn: stawka vat * netto + netto = brutto
    this.fakturaKontraktowca.updateValueAndValidity();
    this.fakturaKontraktowca?.statusChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(status => {
   //   this.fakturaKontraktowca.markAllAsTouched()
      if (this.fakturaKontraktowca && this.fakturaKontraktowca.valid === true) {
        this.validFormStatus.emit(true);
        this.fakturyService.showSuccess("Formularz wypełniony poprawnie")
      } else {
        this.validFormStatus.emit(false);
        // this.fakturyService.showWarning("Brak wypełnionych wszystkich pól")
      }
    });
  }

  zmianaKwotyBrutto($event: any, index: number) {
    let kwotaBruttoValue = this.fakturyService.convertToFloat($event.target.value)
    //  this.podatekFormLista.at(index).get("kwotaBrutto")?.setValue(this.fakturyService.convertInput(kwotaBruttoValue), {emitEvent: false})
  }

  zmianaKwotyVAT($event: any, index: number) {
    let kwotaVatValue = this.fakturyService.convertToFloat($event.target.value)
    let kwotaNetto = this.fakturyService.convertToFloat(this.podatekFormLista.controls[index].get("kwotaNetto")?.value);
    let suma = kwotaVatValue + kwotaNetto
    this.podatekFormLista.at(index).get("kwotaBrutto")?.setValue(this.fakturyService.convertInput(suma), {emitEvent: false})
  }

  zmianaKwotyNetto($event: any, index: number) {
    let stawkaVAT = this.fakturyService.convertToFloat(this.podatekFormLista.controls[index].get("stawkaVAT")?.value)
    let kwotaNettoValue = this.fakturyService.convertToFloat($event.target.value)
    let kwotaVAT = this.fakturyService.convertToFloat(this.podatekFormLista.controls[index].get("kwotaVAT")?.value);
    let suma = kwotaNettoValue + kwotaVAT
    let vat = kwotaNettoValue * stawkaVAT

    if (stawkaVAT) {
      suma = vat + kwotaNettoValue
      this.podatekFormLista.at(index).get("kwotaVAT")?.setValue(this.fakturyService.convertInput(vat), {emitEvent: false})
    }

    this.podatekFormLista.at(index).get("kwotaBrutto")?.setValue(this.fakturyService.convertInput(suma), {emitEvent: false})

  }

  zmianaStawkiVat($event: MatSelectChange, index: number) {
    let vatValue = this.fakturyService.convertToFloat($event.value)
    const formArrayValue = this.podatekFormLista.controls[index].value;
    let kwotaNetto = this.fakturyService.convertToFloat(formArrayValue['kwotaNetto'])
    let vat = kwotaNetto * vatValue;
    let suma = vat + kwotaNetto;
    this.podatekFormLista.controls[index].get("kwotaVAT")?.setValue(this.fakturyService.convertInput(vat), {emitEvent: false})
    this.podatekFormLista.controls[index].get("kwotaBrutto")?.setValue(this.fakturyService.convertInput(suma), {emitEvent: false})
  }

  wyliczanieFormularza() {
    this.podatekFormLista?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe((value) => {
      this.multiSumaKolumn()
    });
  }


  multiSumaKolumn() {
    this.sumaKwota("kwotaNetto");
    this.sumaKwota("kwotaVAT");
    this.sumaKwota("kwotaBrutto");
  }
}
