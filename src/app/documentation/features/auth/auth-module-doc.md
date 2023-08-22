# Authentication Module (AuthModule)

The AuthModule is an Angular module that provides authentication features for the application. It contains components for login, register, verification, OTP verification, forgot password, and change password functionalities. It also imports the SharedModule, which contains common components and services that are used throughout the application.

## Components

The AuthModule declares and exports the following components:

  - _AuthComponent_
      
    The root component of the AuthModule, which acts as a container for the other components. It also handles the routing logic based on the authentication state of the user.


  - [_LoginComponent_](./login-component-doc.md)
  
    The component that allows the user to log in with their email and password. It also provides a link to the forgot password component.
    
    Route: `/auth/login`   

    
  - _RegisterComponent_ (Still in progress - not yet implemented)
  
    The component that allows the user to create a new account with their email, password, and name.
    
    Route: `/auth/register`  


  - [_VerificationComponent_](./verification-component-doc.md)
  
    The component that displays user's contact details, instructing them to select one to which an OTP will be sent for verification.
    
    Route: `/auth/verify`


  - [_OtpVerificationComponent_](./otp-verification-component-doc.md)
  
    The component that allows the user to verify their account by entering a one-time password (OTP) that was sent to their email or phone number. It also a button to resend the OTP if needed.
  
    Route: `/auth/otp`


  - [_ForgotPasswordComponent_](./forgot-password-component-doc.md)
  
    The component that allows the user to reset their password by entering their email and phone number to verify correct account details. It also sends an OTP to their email.
    
    Route: `/auth/forgot-password` 


  - [_ChangePasswordComponent_](./change-password-component-doc.md)
  
    The component that allows the user to change their password by entering their old and new passwords. It also validates the passwords and displays error messages if needed.
    
    Route: `/auth/change-password`

## Imports

The AuthModule imports the following modules:

- _CommonModule_: The module that provides common Angular directives and pipes, such as ngIf, ngFor, etc.
- _ReactiveFormsModule_: The module that provides reactive forms functionality, such as FormGroup, FormControl, Validators, etc.
- _FormsModule_: The module that provides template-driven forms functionality, such as ngModel, ngForm, etc.
- _AuthRoutingModule_: The module that defines the routes for the AuthModule components, such as /login, /register, /verification, etc.
- _SharedModule_: The module that contains common components and services that are used throughout the application.

