# OtpVerificationComponent

The OtpVerificationComponent is an Angular component that allows the user to verify their account by entering a one-time password (OTP) that was sent to their email or phone number. 

It also provides a button to resend the OTP if needed.

It also handles different OTP processes, such as password reset or login.

## Methods

The OtpVerificationComponent implements the following methods:


  - **_ngOnInit()_**
    
    - This method is called when the component is initialized. It performs the following tasks:
    
      - Gets the otpProcess from the query params, which indicates the reason for the OTP verification, such as 'password-reset' or 'login'.
      - Logs the otpProcess to the console.
      
  
  - **_ngOnDestroy()_**
    
    - This method is called when the component is destroyed. It performs no tasks.
    

  - **_verifyOtp(event: any)_**
    
    - This method is called when the user submits the OTP.
    
    - It takes an event parameter, which is a boolean value that indicates whether the OTP verification was successful or not. It performs the following tasks:
      
      - If the event is true, which means that the OTP verification was successful, performs the following tasks:
         - If the otpProcess is 'password-reset', navigates to '/auth/change-password' route, which shows the ChangePasswordComponent.
         - Otherwise, gets the details from local storage, which contains the username and password of the user, and calls the authService.attemptAuth(details) method, which logs in the user and redirects them to the dashboard page.
      - If the event is false, which means that the OTP verification failed, returns without doing anything.
