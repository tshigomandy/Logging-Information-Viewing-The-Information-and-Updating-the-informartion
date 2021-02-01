import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCanActivateChildGuard } from './core/guards/auth-can-activate-child.guard';
import { AuthComponent } from './modules/auth/auth.component';
import { MainComponent } from './modules/main.component';

const routes: Routes = [
  { path: '',
    component: MainComponent,
    loadChildren: () => import('./modules/main.module').then(m => m.MainModule),
    canActivateChild: [AuthCanActivateChildGuard] },
  { path: 'auth',
    component: AuthComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
