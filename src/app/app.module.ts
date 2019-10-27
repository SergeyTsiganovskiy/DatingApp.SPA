import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpModule,
      FormsModule 
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
