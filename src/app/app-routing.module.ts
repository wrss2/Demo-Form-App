import { NgModule } from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {AppComponent} from "./app.component";
import {FakturaKontraktowcaComponent} from "./faktura-kontraktowca/faktura-kontraktowca.component";


const appRoutes: Routes = [
	{path: '', redirectTo: 'Faktura' , pathMatch: 'full'},
  {path: 'Faktura', component: FakturaKontraktowcaComponent},
];

@NgModule({
  declarations: [],
  imports: [
        RouterModule.forRoot(
            appRoutes, {preloadingStrategy: PreloadAllModules}
        )
  ],
  exports: [
		RouterModule
  ]

})
export class AppRoutingModule { }
