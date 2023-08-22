# Verification Component

This component displays user's contact details, instructing them to select one to which an OTP will be sent for verification.

Route: `/auth/verify`

## Methods

The VerificationComponent implements the following methods:

- ngOnInit(): This method is called when the component is initialized. It performs the following tasks:
  - Get extras from local storage, which contains the user's email and phone number (if any).
  - Create account verification types populated with extras, such as "Via email: ab*****@gmail.com" and "Via sms: +254**********".
  - Set selected account to the first account verification type by default.
 
 
- onSelectAccount(account: AuthVerification): This method is called when the user selects an account of type AuthVerification, which contains the name, type, and icon of the verification method. It performs the following tasks:
  - Set selected account to the account parameter.
  - Set isLoading to true, which shows a loading spinner on the UI.
  - Determine the verification type, either "email" or "sms", based on the type attribute of the selected account.
  - Get the username from the extras in local storage, which is either the email or phone number of the user.
  - Call the authService.sentVerificationOtp(username, verificationType) method, which sends a one-time password (OTP) to the user's email or phone number.
  - Subscribe to the response of the authService.sentVerificationOtp(username, verificationType) method, and perform the following tasks:
    - If the response is truthy, create a channel object that contains the action, channel, and value of the verification process, and store it in local storage as 'otp-channel'.
    - Navigate to '/auth/otp' route, which shows the OtpVerificationComponent.
    - Set isLoading to false, which hides the loading spinner on the UI.
   
 
- ngOnDestroy(): This method is called when the component is destroyed. It performs no tasks.
