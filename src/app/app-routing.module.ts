import { NgModule } from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {AppComponent} from "./app.component";
import {FakturaKontraktowcaComponent} from "./faktura-kontraktowca/faktura-kontraktowca.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AuthGuard} from "./services/auth.guard";
import {CatsListComponent} from "./cats-list/cats-list.component";



const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'faktura', component: FakturaKontraktowcaComponent,canActivate: [AuthGuard]},
  {path: 'koty', component: CatsListComponent,canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login' , pathMatch: 'full'},
  {path: '**', redirectTo: '/login' , pathMatch: 'full'},
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
