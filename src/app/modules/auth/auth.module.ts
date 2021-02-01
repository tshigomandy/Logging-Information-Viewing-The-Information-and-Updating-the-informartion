import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { HomescreenComponent } from './homescreen/homescreen.component';


@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent, HomescreenComponent],
  imports: [
    CommonModule,
    CoreModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
