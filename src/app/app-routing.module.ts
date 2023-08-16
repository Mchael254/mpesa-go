import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/auth/home/home.component';



export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'home',
    // canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
    loadChildren: () => import('./features/base/base.module').then(m => m.BaseModule),
  },
  {
    path: '**', redirectTo: ''
  },
];

const config: ExtraOptions = {
  useHash: false,
  enableTracing: true,
  preloadingStrategy: PreloadAllModules,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
