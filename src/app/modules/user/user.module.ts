import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from '../user/user-routing.module';
import { UserComponent } from './user.component';
import { ViewComponent } from './view/view/view.component';
import { HomeComponent } from './home/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LogComponent } from './log/log/log.component';
import { IncidentEditComponent } from './incident-edit/incident-edit/incident-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MainRoutingModule } from '../main-routing.module';


@NgModule({
  declarations: [UserComponent, ViewComponent, HomeComponent, IncidentEditComponent, LogComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    MainRoutingModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule
  ],
  exports: [HomeComponent]
})
export class UserModule { }
