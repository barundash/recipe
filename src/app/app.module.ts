import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
//import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module'
import { CoreModule } from './core.module';
//import { AuthModule } from './auth-component/auth.module';

/* Note: Declaration of a component or directive or a pipe can be done only once. Multiple declaration of
same component into 2 different modules would lead to compilation error. If the component needs to be
used multiple times, the module can be imported containing that particular component*/

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule, /*provides access to *ngif, *ngfor and other directives and should be declared only
    once as it does some start up work of the application*/
    AppRoutingModule,
    /*FormsModule, // access to template driven forms. We remove forms module from here as its being
    imported individually in each module of different components */
    ReactiveFormsModule, // access to reactive forms
    HttpClientModule, // access to HTTP request calling services to be injected into other services.
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
