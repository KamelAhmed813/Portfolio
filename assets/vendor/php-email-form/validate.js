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
      console.log('Form submission started');

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptchaSiteKey = thisForm.getAttribute('data-recaptcha-site-key');
      
      console.log('Form action:', action);
      console.log('reCAPTCHA site key:', recaptchaSiteKey);
      console.log('grecaptcha available:', typeof grecaptcha !== 'undefined');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Temporarily disable reCAPTCHA due to invalid site key
      // TODO: Fix reCAPTCHA configuration
      console.log('reCAPTCHA temporarily disabled - submitting form directly');
      submitForm(thisForm, action);
      
      /* Original reCAPTCHA code (commented out until fixed):
      if (recaptchaSiteKey && typeof grecaptcha !== 'undefined') {
        // Execute reCAPTCHA with the site key
        grecaptcha.ready(function() {
          grecaptcha.execute(recaptchaSiteKey, {action: 'contact_form_submit'})
          .then(function(token) {
            // Add reCAPTCHA token to form data
            let formData = new FormData(thisForm);
            formData.append('g-recaptcha-response', token);
            submitForm(thisForm, action, formData);
          })
          .catch(function(error) {
            console.error('reCAPTCHA error:', error);
            displayError(thisForm, 'reCAPTCHA verification failed. Please try again.');
          });
        });
      } else {
        // No reCAPTCHA or grecaptcha not loaded, submit directly
        console.log('Submitting form without reCAPTCHA');
        submitForm(thisForm, action);
      }
      */
    });
  });

  function submitForm(thisForm, action, formData = null) {
    console.log('submitForm called with action:', action);
    
    thisForm.querySelector('.loading').classList.add('d-block');
    thisForm.querySelector('.error-message').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');

    if (!formData) {
      formData = new FormData(thisForm);
    }

    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key + ': ' + value);
    }

    php_email_form_submit(thisForm, action, formData);
  }

  function php_email_form_submit(thisForm, action, formData) {
    console.log('Making fetch request to:', action);
    
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
