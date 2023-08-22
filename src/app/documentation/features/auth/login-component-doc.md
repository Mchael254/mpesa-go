# Login Component

The LoginComponent is an Angular component that allows the user to log in with their email and password. It also provides a link to the forgot password component. 

It also allows the user to remember their login details and store them in local storage.

## Methods

The LoginComponent implements the following methods:

  - **_ngOnInit()_**
    - This method is called when the component is initialized. It performs the following tasks:
  
      - Creates the login form by calling the createForm() method.
      - Checks if the user is authenticated by subscribing to the authService.isAuthenticated observable.
      - Gets the login details from local storage and if present, sets them as default values for the login form fields.


  - **_createForm()_**
    
    - This method creates the login form using the FormBuilder. 
    - It sets the username and password as required fields, and sets the password minimum length to 6. It also adds a rememberMe field to allow the user to store their login details in local storage.


  - **_togglePasswordVisibility()_**

    - This method toggles the password visibility by changing the value of the showPassword boolean variable. 
    - It also changes the icon of the password field accordingly.


  - **_authAttempt()_** 

    - This method tries to log in the user with their email and password, and shows a loading spinner while doing so.
    - It sends the user’s credentials to the backend and handles the response. 
    - If the response indicates a successful login, it stores some data in local storage and redirects the user to the verification page. 
    - Otherwise, it shows an error message.
        

  - **_ngOnDestroy()_**

    - This method is called when the component is destroyed. It performs no tasks.
