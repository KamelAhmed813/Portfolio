/**
* PHP Email Form Validation - v3.10
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Submit form directly without reCAPTCHA
      submitForm(thisForm, action);
    });
  });

  function submitForm(thisForm, action, formData = null) {
    
    thisForm.querySelector('.loading').classList.add('d-block');
    thisForm.querySelector('.error-message').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');

    if (!formData) {
      formData = new FormData(thisForm);
    }

    php_email_form_submit(thisForm, action, formData);
  }

  function php_email_form_submit(thisForm, action, formData) {
    
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.text();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      try {
        const response = JSON.parse(data);
        // Handle Formspree response format
        if (response.ok === true || response.status === 'success') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset(); 
        } else {
          throw new Error(response.message || 'Form submission failed');
        }
      } catch (e) {
        // Fallback for non-JSON responses
        if (data.trim() == 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset(); 
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
        }
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
