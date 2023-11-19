import { Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe, DecimalPipe} from "@angular/common";
import {FakturyService} from "../services/faktury.service";
import {podatekWyliczeniaLista, responseAPI} from "../models/faktura-kontraktowca";
import * as _ from 'lodash';

@Component({
  selector: 'app-faktura-kontraktowca',
  templateUrl: './faktura-kontraktowca.component.html',
  styleUrls: ['./faktura-kontraktowca.component.scss'],
})
export class FakturaKontraktowcaComponent implements OnInit {

  fakturaKontraktowca: FormGroup;
  dataSource:MatTableDataSource<AbstractControl> = new MatTableDataSource<AbstractControl>()
  isValidForm!:boolean;

  get podatekFormLista() : FormArray {
    return (this.fakturaKontraktowca.get('podatekFormLista') as FormArray);
  }

  constructor(
    private fb: FormBuilder,
    private fakturyService: FakturyService,
    private datePipe: DatePipe,
  ) {

    this.fakturaKontraktowca = this.fb.group({
      nip: [9377009515, Validators.required],
      waluta: ['PLN', Validators.required],
      dataWystawienia: [null, Validators.required],
      dataDostawy: [null, Validators.required],
      terminPlatnosci: [null, Validators.required],
      kwotaNettoSuma: [this.fakturyService.convertInput(0)],
      kwotaVATSuma: [this.fakturyService.convertInput(0)],
      kwotaBruttoSuma: [this.fakturyService.convertInput(0)],
      podatekFormLista: new FormArray([])
    });
  }


  ngOnInit(): void {
  }


  onSubmit(): void {
    let formValue = this.fakturaKontraktowca.value
    let transformPodatekFormLista =  _.cloneDeep(this.podatekFormLista.value);

    transformPodatekFormLista.map((lista:podatekWyliczeniaLista )=>{
      for (const [key, value] of Object.entries(lista) as [keyof podatekWyliczeniaLista, any][]) {
        lista[key] = this.fakturyService.convertToFloat(value);
      }
    })

    let body:responseAPI = {
      nip: formValue.nip,
      waluta: formValue.waluta,
      kwotaNettoSuma: this.fakturyService.convertToFloat(formValue.kwotaNettoSuma),
      kwotaVATSuma: this.fakturyService.convertToFloat(formValue.kwotaVATSuma),
      kwotaBruttoSuma: this.fakturyService.convertToFloat(formValue.kwotaBruttoSuma),
      dataWystawienia: this.datePipe.transform(formValue.dataWystawienia, 'dd.MM.yyyy') || '',
      dataDostawy: this.datePipe.transform(formValue.dataDostawy, 'dd.MM.yyyy') || '',
      terminPlatnosci: this.datePipe.transform(formValue.dataWystawienia, 'dd.MM.yyyy') || '',
      podatekWyliczeniaLista : transformPodatekFormLista
    }

    this.fakturyService.saveFakturaKontraktowca(body).subscribe({
      next: (response)=> {
        console.log("saveFakturaKontraktowca", response)
        this.fakturyService.showWarning(`Zapisano formularz prawidłowo`,'Zapis formualrza')
      },
      error: (error)=> {
        console.log("saveFakturaKontraktowca", error)
        this.fakturyService.showWarning(`Błąd zapisu formularza`, 'Zapis formualrza')
      }
    });
  }

  changeFormStatus(status:boolean){
    this.isValidForm = status;
  }


}
