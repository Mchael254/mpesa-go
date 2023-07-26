import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { VerificationComponent } from './verification/verification.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { 
        path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'verify',
        component: VerificationComponent,
      },
      {
        path: 'otp',
        component: OtpVerificationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      // {
      //   path: 'email-otp',
      //   component: EmailOtpComponent,
      // },
      // {
      //   path: 'modal',
      //   component: ModalComponent,
      // },
      // {
      //   path: 'pass-modal',
      //   component: ChangePassModalComponent,
      // },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
