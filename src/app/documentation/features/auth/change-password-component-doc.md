# ChangePasswordComponent

This component allows the user to change their password by entering their new password and confirming it. It also validates the passwords and displays error messages if needed.


## Methods

The ChangePasswordComponent implements the following methods:


  - **_ngOnInit()_**

    - This method is called when the component is initialized. It performs the following tasks:
    
    - Creates the change password form by calling the formBuilder.group() method. It sets the newPassword and confirmPassword fields as required, and adds validators for password length and confirmation.


  - **_get f()_**

    - This method is a convenience getter for easy access to form fields. It returns the form controls object.


  - **_onSave()_**
    
    - This method is called when the user submits the change password form. 
      
    - It performs the following tasks:
        
     - Sets submitted to true, which enables form validation.
       
     - If the form is valid, performs the following tasks:
        
       - Gets the username and email from the extras in session storage, which were stored by the ForgotPasswordComponent.
          
       - Gets the newPass and confirmPass values from the form fields.
          
       - Calls the authService.resetPassword(username, newPass, "N", email) method, which sends a POST request to the backend with the username, new password, and email of the user, and resets their password.
          
       - Subscribes to the response of the authService.resetPassword(username, newPass, "N", email) method, and performs the following tasks:
            
       - If the response is true, which means that the password reset was successful, performs the following tasks:
          
          - Displays a success message with 'Successfully updated your password' using the globalMessagingService.displaySuccessMessage(title, message) method.
              
          - After 3 seconds, navigates to '/auth/' route, which shows the LoginComponent.
            
          - If the response is false, which means that the password reset failed, performs the following tasks:
              
            - Sets errorOccurred to true and errorMessage to 'Something went wrong.Please try Again'.
              
            - Displays an error message with 'Something went wrong.Please try Again' using the globalMessagingService.displayErrorMessage(title, message) method.
