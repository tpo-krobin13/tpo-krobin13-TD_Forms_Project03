// Global variables
const SHOW = 'visible';
const HIDE = 'hidden';
const NONE = 'none';
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
    regex: /^\w{1,}$/,
    errorMsg: 'Name field can not be blank',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'email',
    regex: /\w{4,}/,
    errorMsg: 'Email must be at least 4 characters',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'email',
    regex: /^\w{1,}@\w{1,}\.\w{2,10}/,
    errorMsg: 'Email must include a valid email address',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'cc-num',
    regex: /^\d{13,16}$/,
    errorMsg: 'Please ensure the credit card is 13-16 digits',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'zip',
    regex: /^\d{5,5}$/,
    errorMsg: 'Please ensure the zip is 5 digit',
    validationfunction: basicRegExpValidates
  },
  {
    fieldId: 'cvv',
    regex: /^\d{3,3}$/,
    errorMsg: 'Please ensure the cvv code is 3 digits',
    validationfunction: basicRegExpValidates
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
        selectFieldByName(`.${paymentOptions[i].fields[j]}`).style.display = '';
      }
    } else {
      for (let j = 0; j < paymentOptions[i].fields.length; j++) {
        selectFieldByName(`.${paymentOptions[i].fields[j]}`).style.display = NONE;
      }
    }
  }
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
  } else {
    clearFormErrors(fieldId);
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
  } else {
    clearFormErrors(fieldId);
  }
  return errorsArray;
}

// display form errors
function handleFormErrors () {
  for (let i = 0; i < allFormErrors.length; i++) {
    selectFieldByName(allFormErrors[i].fieldId).parentElement.classList.add('not-valid');
    selectFieldByName(allFormErrors[i].fieldId).parentElement.classList.remove('valid');
    if (allFormErrors[i].fieldId === 'email') {
      const emailMsgArr = [];
      for (let j = 0; j < allFormErrors.length; j++) {
        emailMsgArr.push(allFormErrors[j].errorMsg);
      }
      selectFieldByName(allFormErrors[i].fieldId).parentElement.lastElementChild.innerHTML = emailMsgArr[0];
    }
    selectFieldByName(allFormErrors[i].fieldId).parentElement.lastElementChild.style.display = 'inline';
  }
  allFormErrors = [];
}

// remove form errors
function clearFormErrors (fieldId) {
  selectFieldByName(fieldId).parentElement.classList.remove('not-valid');
  selectFieldByName(fieldId).parentElement.classList.add('valid');
  selectFieldByName(fieldId).parentElement.lastElementChild.style.display = 'none';
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
  const selectedText = selectFieldByName('design').value;
  selectFieldByName('color').options[0].innerText = 'Select a color';
  selectFieldByName('color').options[0].selected = true;
  for (let i = 1; i < selectFieldByName('color').options.length; i++) {
    const elemObject = selectFieldByName('color').options[i];
    if ((elemObject.getAttribute('data-theme') != null) && (elemObject.getAttribute('data-theme') !== selectedText)) {
      selectFieldByName('color').options[i].style.display = 'none';
    } else {
      selectFieldByName('color').options[i].style.display = 'inline';
    }
  }
  selectFieldByName('shirt-colors').style.visibility = SHOW;
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
  const allInputItems = document.getElementsByTagName('input');
  const activityElementsArr = [];
  if (event.target.tagName === 'INPUT') {
    for (let i = 0; i < allInputItems.length; i++) {
      const activityPrice = allInputItems[i].getAttribute('data-cost');
      // add activity items to an array to clear any errors
      if (activityPrice > 0) {
        activityElementsArr.push(allInputItems[i]);
      }
      if (activityPrice && allInputItems[i].checked) {
        totalActivitiesCost += +activityPrice;
      }
    }
  }
  selectFieldByName('activities-cost').innerHTML = `Total: $${totalActivitiesCost}`;
  clearExistingActivitiesErrors(activityElementsArr);
});

// check to see if the activity block is in error state and clear if something is checked
function clearExistingActivitiesErrors (inputElements) {
  if (selectFieldByName('activities').classList.contains('not-valid')) {
    for (let i = 0; i < inputElements.length; i++) {
      if (inputElements[i].checked) {
        selectFieldByName('activities').classList.add('valid');
        selectFieldByName('activities').classList.remove('not-valid');
        selectFieldByName('activities').lastElementChild.style.display = 'none';
        break;
      }
    }
  }
}

// send a function for each validation
document.forms[0].addEventListener('submit', e => {
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
  allFormErrors = [];
});

// added on keyup evet listners for forms elements
document.forms[0].addEventListener('keyup', event => {
  //  clearFormErrors();
  for (let i = 0; i < fieldValidations.length; i++) {
    if ((event.target.id === fieldValidations[i].fieldId)) {
      const errorsArray = fieldValidations[i].validationfunction(fieldValidations[i]);
      if (errorsArray.length > 0) {
        allFormErrors = [...allFormErrors, ...errorsArray];
      }
      event.preventDefault();
    }
  }
  handleFormErrors();
  allFormErrors = [];
});

// Execution
// ----------------------------------------------------------------------------------------------

// create focus on the first form elements
selectFieldByName('name').focus();
toggleFieldVisibility('other-job-role', HIDE);
selectFieldByName('shirt-colors').style.visibility = HIDE;
selectInputFocusByNameAndInex('payment', 1);
paymentOptionSet('credit-card');
addCheckboxEventListners();