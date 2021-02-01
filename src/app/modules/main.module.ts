import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianModule } from './technician/technician.module';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UpdateProfileModule } from './update-profile/update-profile.module';
import { MainComponent } from './main.component';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from './user/home/home/home.component';
import { IncidentEditComponent } from './user/incident-edit/incident-edit/incident-edit.component';
import { LogComponent } from './user/log/log/log.component';
import { ViewComponent } from './user/view/view/view.component';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UserModule } from './user/user.module';



@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule, CoreModule,
    MainRoutingModule, SharedModule, TechnicianModule, DashboardModule, UpdateProfileModule, UserModule,
    MainRoutingModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule
  ],
  exports: [MainComponent]
})
export class MainModule { }
