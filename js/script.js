
// Global variables
const SHOW = 'visible';
const HIDE = 'hidden';
let allFormErrors = [];

// data objects used to bind the payment types to the accompanying field[s]
const paymentOptions =
  [{
    type: 'credit-card',
    fields: ['month-box', 'year-box', 'credit-card-box']
  },
  {
    type: 'paypal',
    fields: ['paypal']
  },
  {
    type: 'bitcoin',
    fields: ['bitcoin']
  }];

// helper objects that support field validation. Identifies the a validation function that is used to individually validate the field.
// The other properties support the validation
const fieldValidations = [
  {
    fieldId: 'name',
    regex: /^\w+$/,
    errorMsg: 'Name field can not be blank',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'email',
    regex: /^\w{1,}@\w{1,}\.\w{2,10}/,
    errorMsg: 'Email must include a valid email address',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'payment',
    fieldIdValue: 'credit-card',
    field_regex: [
      { 'cc-num': /^\d{13,16}$/, errorMsg: 'Please ensure the credit card is 13-16 digits' },
      { zip: /^\d{5,5}$/, errorMsg: 'Please ensure the zip is 5 digit' },
      { cvv: /^\d{3,3}$/, errorMsg: 'Please ensure the cvv code is 3 digits' }],
    errorMsg: 'Please ensure the credit card is 13-16 digits, the zip is 5 digits and the cvv code is 3 digits',
    validationfunction: creditCardValidates
  },
  {
    fieldId: 'activities-box',
    errorMsg: 'Please ensure at least one activity is selected',
    validationfunction: activitiesValidates
  }
  // create an object that is set up to check a given field.
];

// Functions

// ----------------------------------------------------------------------------------------------

// this helper function will set focus on an input selected that has the given value as an id or className (adding  . to the string is allowed)
function selectInputFocusByNameAndInex (inputValue, index) {
  const selectElem = selectFieldByName(inputValue);
  selectElem.options[index].selected = true;
}

// shortens element selection and searches by id or className
function selectFieldByName (inputString) {
  const idElem = document.getElementById(inputString);
  if (idElem) {
    return idElem;
  } else {
    return document.querySelector(inputString);
  }
}

// function to toggle field  visibility
function toggleFieldVisibility (formElementName, displayValue) {
  const formElem = selectFieldByName(formElementName);
  formElem.style.visibility = displayValue;
}

// manages visibility for payment options if credit card is selected
// pulled out of event listner to be called on page load and from event listner
function paymentOptionSet (paymentOption) {
  for (let i = 0; i < paymentOptions.length; i++) {
    if (paymentOption === paymentOptions[i].type) {
      for (let j = 0; j < paymentOptions[i].fields.length; j++) {
        selectFieldByName(`.${paymentOptions[i].fields[j]}`).style.visibility = SHOW;
      }
    } else {
      for (let j = 0; j < paymentOptions[i].fields.length; j++) {
        selectFieldByName(`.${paymentOptions[i].fields[j]}`).style.visibility = HIDE;
      }
    }
  }
}

// function used to validate credit card fields
function creditCardValidates (fieldValidationObj) {
  const errorsArray = [];
  if (selectFieldByName(fieldValidationObj.fieldId).value === fieldValidationObj.fieldIdValue) {
    for (let i = 0; i < fieldValidationObj.field_regex.length; i++) {
      const fieldToValidate = Object.keys(fieldValidationObj.field_regex[i])[0];
      const regex = fieldValidationObj.field_regex[i][fieldToValidate];
      const ccErrorMsgField = Object.keys(fieldValidationObj.field_regex[i])[1];
      const ccErrorMessage = fieldValidationObj.field_regex[i][ccErrorMsgField];
      const fieldPassedValidation = regex.test(document.getElementById(fieldToValidate).value);

      if (!fieldPassedValidation) {
        errorsArray.push({ fieldId: fieldToValidate, errorMsg: ccErrorMessage });
      }
    }
  }
  return errorsArray;
}

// validation function used for basic regx validations
function basicRegExpValidates (fieldValidationObj) {
  const errorsArray = [];
  const fieldId = fieldValidationObj.fieldId;
  const regex = RegExp(fieldValidationObj.regex);
  const fieldElem = document.getElementById(fieldId);
  const errMsg = fieldValidationObj.errorMsg;
  const passedValidation = regex.test(fieldElem.value);
  if (!passedValidation) {
    errorsArray.push({ fieldId: fieldId, errorMsg: errMsg });
  }
  return errorsArray;
}

// validation function used to validate activities
function activitiesValidates (fieldValidationObj) {
  const errorsArray = [];
  let atLeastOneItemChecked = false;
  const fieldId = fieldValidationObj.fieldId;
  const errorMessage = fieldValidationObj.errorMsg;
  for (let i = 0; i < document.getElementsByTagName('input').length; i++) {
    if (document.getElementsByTagName('input')[i].getAttribute('data-cost') && document.getElementsByTagName('input')[i].checked) {
      atLeastOneItemChecked = true;
      break;
    }
  }
  if (!atLeastOneItemChecked) {
    errorsArray.push({ fieldId: fieldId, errorMsg: errorMessage });
  }
  return errorsArray;
}

// display form errors
function handleFormErrors () {
  for (let i = 0; i < allFormErrors.length; i++) {
    selectFieldByName(allFormErrors[i].fieldId).parentElement.classList.add('not-valid');
    selectFieldByName(allFormErrors[i].fieldId).parentElement.classList.remove('valid');
    selectFieldByName(allFormErrors[i].fieldId).parentElement.lastElementChild.style.display = 'inline';
  }
}

// remove form errors
function clearFormErrors () {
  for (let i = 0; i < allFormErrors.length; i++) {
    selectFieldByName(allFormErrors[i].fieldId).parentElement.classList.remove('not-valid');
    selectFieldByName(allFormErrors[i].fieldId).parentElement.classList.add('valid');
    selectFieldByName(allFormErrors[i].fieldId).parentElement.lastElementChild.style.display = 'none';
  }
  allFormErrors = [];
}

// Event Listeners
// ---------------------------------------------------------------------------------------------------------

// Event listener to manage other job field
selectFieldByName('title').addEventListener('change', e => {
  const otherJobRoleOptions = selectFieldByName('title').options;
  const otherSelected = otherJobRoleOptions[otherJobRoleOptions.length - 1].selected === true;
  if (otherSelected) {
    toggleFieldVisibility('other-job-role', SHOW);
  } else {
    toggleFieldVisibility('other-job-role', HIDE);
  }
});

// add event listener for color drop downin
selectFieldByName('design').addEventListener('change', e => {
  if (selectFieldByName('design').value !== 'Select Theme') {
    selectFieldByName('color').disabled = false;
  }
  const selectedText = selectFieldByName('design').value;
  for (let i = 0; i < selectFieldByName('color').options.length; i++) {
    const elemObject = selectFieldByName('color').options[i];
    if ((elemObject.getAttribute('data-theme') != null) && (elemObject.getAttribute('data-theme') !== selectedText)) {
      selectFieldByName('color').options[i].style.display = 'none';
    } else {
      selectFieldByName('color').options[i].style.display = 'inline';
    }
  }
});

// Creates a listner on the activitiy checkbox and alters visibility for on focus /blur
function addCheckboxEventListners () {
  const inputs = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('focus', event => {
      inputs[i].parentElement.className = 'focus';
    });
    inputs[i].addEventListener('change', event => {
      toggleSimultaneousActivities(inputs[i]);
    });
    inputs[i].addEventListener('blur', event => {
      inputs[i].parentElement.className = '';
    });
  }
}

// identifies courses occuring at the same time and toggles them from enabled to disabled and back
function toggleSimultaneousActivities (inputObj) {
  const inputs = document.querySelectorAll('input[type="checkbox"]');
  const currentDayTime = inputObj.getAttribute('data-day-and-time');
  const currentCheckBoxName = inputObj.name;
  for (let i = 0; i < inputs.length; i++) {
    const tempCurrentDayTime = inputs[i].getAttribute('data-day-and-time');
    const tempCheckBox = inputs[i].name;

    if ((tempCurrentDayTime === currentDayTime) && (currentCheckBoxName !== tempCheckBox)) {
      if (inputObj.checked) {
        inputs[i].classList.add('disabled');
        inputs[i].parentElement.classList.add('disabled');
        inputs[i].disabled = true;
      } else {
        inputs[i].classList.remove('disabled');
        inputs[i].parentElement.classList.remove('disabled');
        inputs[i].disabled = false;
      }
    }
  }
}
// Event listener to manage payment options
selectFieldByName('payment').addEventListener('change', event => {
  paymentOptionSet(event.target.value);
});

// add field listener for activities cost calculations
selectFieldByName('activities').addEventListener('change', event => {
  let totalActivitiesCost = 0;
  if (event.target.tagName === 'INPUT') {
    for (let i = 0; i < document.getElementsByTagName('input').length; i++) {
      const activityPrice = document.getElementsByTagName('input')[i].getAttribute('data-cost');
      if (activityPrice && document.getElementsByTagName('input')[i].checked) {
        totalActivitiesCost += +activityPrice;
      }
    }
  }
  selectFieldByName('activities-cost').innerHTML = `Total: $${totalActivitiesCost}`;
});

// send a function for each validation
document.forms[0].addEventListener('submit', e => {
  clearFormErrors();
  for (let i = 0; i < fieldValidations.length; i++) {
    const errorsArray = fieldValidations[i].validationfunction(fieldValidations[i]);
    if (errorsArray.length > 0) {
      allFormErrors = [...allFormErrors, ...errorsArray];
    }
  }
  if (allFormErrors.length > 0) {
    e.preventDefault();
    handleFormErrors();
  }
});

// added on keyup event listners for email form elements
selectFieldByName('email').addEventListener('keyup', event => {
  selectFieldByName('email').parentElement.classList.add('valid');
  selectFieldByName('email').parentElement.classList.remove('not-valid');
  selectFieldByName('email').parentElement.lastElementChild.style.display = 'none';

  const regex = /^\w{1,}@\w{1,}\.com$/;
  const elemValue = event.target.value;
  let errorMsg = '';
  if (elemValue.length < 5) {
    errorMsg = 'Email must have at a minimum 4 characters';
  } else if (!regex.test(elemValue)) {
    errorMsg = 'Email must include a valid email address';
  }

  if (errorMsg.length > 0) {
    event.preventDefault();
    selectFieldByName('email').parentElement.classList.add('not-valid');
    selectFieldByName('email').parentElement.classList.remove('valid');
    selectFieldByName('email').parentElement.lastElementChild.innerHTML = errorMsg;
    selectFieldByName('email').parentElement.lastElementChild.style.display = 'inline';
    allFormErrors.length = 0;
  }
});

// added on keyup evet listners for forms elements
document.forms[0].addEventListener('keyup', event => {
  clearFormErrors();
  for (let i = 0; i < fieldValidations.length; i++) {
    if ((event.target.id === fieldValidations[i].fieldId) && (fieldValidations[i].fieldId !== 'email')) {
      const errorsArray = fieldValidations[i].validationfunction(fieldValidations[i]);
      if (errorsArray.length > 0) {
        allFormErrors = [...allFormErrors, ...errorsArray];
      }
      event.preventDefault();
      handleFormErrors();
    }
  }
});

// Execution
// ----------------------------------------------------------------------------------------------

// create focus on the first form elements
selectFieldByName('name').focus();
toggleFieldVisibility('other-job-role', HIDE);
selectFieldByName('color').disabled = true;
selectInputFocusByNameAndInex('payment', 1);
paymentOptionSet('credit-card');
addCheckboxEventListners();
