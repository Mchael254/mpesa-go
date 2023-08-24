# ForgotPasswordComponent

This component allows the user to reset their password by entering their email and phone number. 

It also verifies the account details and sends an OTP to the user's email.

## Methods

The ForgotPasswordComponent implements the following methods:


  - **_ngOnInit()_**
  
    - This method is called when the component is initialized. It performs the following tasks:
      - Creates the verify details form by calling the createForm() method.

    
 - **_createForm()_**
  
    - This method creates the verify details form using the FormBuilder.
    - It sets the email and phone number as required fields, and adds validators for email format .

  
 - **_get f()_**
  
    - This method is a convenience getter for easy access to form fields. It returns the form controls object.


 - **_onSubmit()_** 
  
    - This method is called when the user submits the verify details form. 
    - It performs the following tasks:
   
     - Sets submitted to true, which enables form validation.
   
     - If the form is valid, performs the following tasks:
       
       - Gets the email and phone number values from the form fields.
       
       - Creates an extras object with action, email, username, and accountToUse attributes, and stores it in session storage as 'extras'.
     
       - Calls the authService.verifyAccount(email, phoneNo) method, which sends a POST request to the backend with the email and phone number values, and verifies if they match with an existing account.
       
       - Subscribes to the response of the authService.verifyAccount(email, phoneNo) method, and performs the following tasks:
        - Displays a success message with the response message using the globalMessagingService.displaySuccessMessage(title, message) method.
        - Sets saveSuccess to true, which shows a confirmation message on the UI.
        - After 3 seconds, navigates to '/auth/otp' route with a query param 'referrer' set to 'password-reset', which shows the OtpVerificationComponent.
