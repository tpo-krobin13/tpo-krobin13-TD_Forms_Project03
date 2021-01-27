# Added updated features for error handling
## Real-time error messages
An on keyup event has been added to the form. This event looks at items added to the fieldValidations object array (line 8).
It clears any errors on the form and then validates.
It loops through these items to looking for a match. The fieldValidations.fieldId will need to match the currently keyed field. 
If a match is found, the event listener then identifies which object handles validation for that field and sends the object to the validation
The validation occurs and if an error is created it's added to an array. An array count greater than zero triggers an error display on the fieldId. 
When the keyup event is triggered again, the clear function is called and the error checking executes the cycle again. 

This feature needs more intigration to play nicely with conditional error messaging and overall form submission. 


## Conditional error message
The conditional error message is implemented on the email field. This feature checks with each key stroke and checks that:
1. the number of characters is greater than 4. It uses an approptiate message
1. the email address is formatted properly. More work is needed currently it only validates .com addresses
