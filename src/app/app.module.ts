import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FakturaKontraktowcaComponent} from './faktura-kontraktowca/faktura-kontraktowca.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {MomentDateAdapter, MomentDateModule} from "@angular/material-moment-adapter";
import {CommonModule, DatePipe, DecimalPipe} from "@angular/common";
import {FakturyService} from "./services/faktury.service";
import {HttpClientModule} from "@angular/common/http";
import {LocaleStringPipe} from './pipes/locale-string-pipe.pipe';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { FormInputComponent } from './ui-components/form-input/form-input.component';
import { SekcjaDatComponent } from './faktura-kontraktowca/components/sekcja-dat/sekcja-dat.component';
import { SekcjaStawkiVATComponent } from './faktura-kontraktowca/components/sekcja-stawki-vat/sekcja-stawki-vat.component';
import {ToastrModule} from "ngx-toastr";
import {MatTooltipModule} from "@angular/material/tooltip";
registerLocaleData(localePl, 'pl');

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    AppComponent,
    FakturaKontraktowcaComponent,
    LocaleStringPipe,
    FormInputComponent,
    SekcjaDatComponent,
    SekcjaStawkiVATComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    AppRoutingModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatTableModule,
    MomentDateModule,
    HttpClientModule,
    MatTooltipModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    FakturyService,
    DecimalPipe,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pl' },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  //  { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  //  {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS , useValue: {floatLabel: 'always'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
