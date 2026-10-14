document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     EMAILJS CONFIGURATION
  ========================== */

  const EMAILJS_PUBLIC_KEY = '_4Ua0xX9OCDBSafav';
  const EMAILJS_SERVICE_ID = 'service_fnkk6w2';
  const EMAILJS_TEMPLATE_ID = 'template_9gph3we';

  /* =========================
     BASIC ELEMENTS
  ========================== */

  const form = document.getElementById('enquiryForm');
  const submitButton = document.getElementById('submitButton');
  const feedback = document.getElementById('formFeedback');
  const feedbackActions = document.getElementById('feedbackActions');
  const successState = document.getElementById('successState');
  const tryAgainButton = document.getElementById('tryAgain');

  const productContext = document.getElementById('productContext');
  const productName = document.getElementById('productName');
  const productField = document.getElementById('productField');

  if (!form) return;


  /* =========================
     EMAILJS INITIALIZATION
  ========================== */

  let emailJsReady = false;

  const initializeEmailJS = () => {

    if (emailJsReady) return true;

    if (!window.emailjs) {
      throw new Error('EmailJS SDK is not loaded.');
    }

    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });

    emailJsReady = true;

    return true;
  };


  /* =========================
     CONFIG CHECK
  ========================== */

  const isConfigured = () => {
    return (
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID
    );
  };


  /* =========================
     REDUCED MOTION / REVEALS
  ========================== */

  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('.reveal');

  if (reducedMotion) {

    revealItems.forEach((item) => {
      item.classList.add('visible');
    });

  } else {

    const observer = new IntersectionObserver(
      (entries, revealObserver) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      observer.observe(item);
    });
  }


  /* =========================
     NAVIGATION
  ========================== */

  const contactNav = document.getElementById('contactNav');

  const updateNav = () => {

    if (!contactNav) return;

    contactNav.classList.toggle(
      'scrolled',
      window.scrollY > 30
    );

  };

  updateNav();

  window.addEventListener(
    'scroll',
    updateNav,
    {
      passive: true
    }
  );


  document.querySelectorAll('#contactMenu .nav-link').forEach((link) => {

    link.addEventListener('click', () => {

      const menu = document.getElementById('contactMenu');

      if (
        menu &&
        menu.classList.contains('show') &&
        window.bootstrap
      ) {

        bootstrap.Collapse
          .getOrCreateInstance(menu)
          .hide();

      }

    });

  });


  /* =========================
     PRODUCT CONTEXT
  ========================== */

  const product =
    new URLSearchParams(window.location.search).get('product');

  if (product) {

    const decodedProduct = product.trim();

    if (productField) {
      productField.value = decodedProduct;
    }

    if (productName) {
      productName.textContent = decodedProduct;
    }

    if (productContext) {
      productContext.hidden = false;
    }

    const requirement =
      document.getElementById('requirementType');

    if (requirement) {

      const matchingOption =
        [...requirement.options].find(
          (option) =>
            option.value.toLowerCase() ===
            decodedProduct.toLowerCase()
        );

      if (matchingOption) {
        requirement.value = matchingOption.value;
      }

    }

  }


  /* =========================
     FIELD ERROR HANDLING
  ========================== */

  const setError = (field, message) => {

    if (!field) return;

    field.classList.toggle(
      'is-invalid',
      Boolean(message)
    );

    const error =
      field
        .closest('.col-12, .col-md-6')
        ?.querySelector('.field-error');

    if (error) {
      error.textContent = message || '';
    }

  };


  /* =========================
     FORM VALIDATION
  ========================== */

  const validateForm = () => {

    const name =
      document.getElementById('fromName');

    const phone =
      document.getElementById('phone');

    const email =
      document.getElementById('email');

    const requirement =
      document.getElementById('requirementType');

    const message =
      document.getElementById('message');

    const consent =
      document.getElementById('consent');

    let valid = true;


    /* NAME */

    setError(
      name,
      name.value.trim()
        ? ''
        : 'Please enter your full name.'
    );


    /* PHONE */

    const cleanPhone =
      phone.value.replace(/\D/g, '');

    setError(
      phone,
      /^[6-9]\d{9}$/.test(cleanPhone)
        ? ''
        : 'Enter a valid 10-digit Indian mobile number.'
    );


    /* EMAIL */

    const emailValue =
      email.value.trim();

    setError(
      email,
      !emailValue ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
        ? ''
        : 'Enter a valid email address.'
    );


    /* REQUIREMENT */

    setError(
      requirement,
      requirement.value
        ? ''
        : 'Please select a requirement type.'
    );


    /* MESSAGE */

    setError(
      message,
      message.value.trim()
        ? ''
        : 'Please add your requirement details.'
    );


    /* CONSENT */

    const consentError =
      document.getElementById('consentError');

    if (consentError) {

      consentError.textContent =
        consent.checked
          ? ''
          : 'Please agree to be contacted regarding your enquiry.';

    }

    consent.classList.toggle(
      'is-invalid',
      !consent.checked
    );


    valid =
      [
        name,
        phone,
        email,
        requirement,
        message
      ].every(
        (field) =>
          !field.classList.contains('is-invalid')
      ) &&
      consent.checked;


    return valid;
  };


  /* =========================
     LOADING STATE
  ========================== */

  const originalButtonHTML =
    submitButton
      ? submitButton.innerHTML
      : '';

  const setLoading = (loading) => {

    if (!submitButton) return;

    submitButton.disabled = loading;

    submitButton.classList.toggle(
      'is-loading',
      loading
    );

    submitButton.innerHTML = loading
      ? '<span>Sending...</span>'
      : originalButtonHTML;

  };


  /* =========================
     WHATSAPP MESSAGE
  ========================== */

  const createWhatsAppMessage = () => {

    const name =
      document.getElementById('fromName')
        ?.value.trim() || '';

    const phone =
      document.getElementById('phone')
        ?.value.trim() || '';

    const email =
      document.getElementById('email')
        ?.value.trim() || '';

    const company =
      document.getElementById('company')
        ?.value.trim() || '';

    const requirement =
      document.getElementById('requirementType')
        ?.value.trim() || '';

    const projectType =
      document.getElementById('projectType')
        ?.value.trim() || '';

    const message =
      document.getElementById('message')
        ?.value.trim() || '';

    return `Hello Vaishali Electricals,

I would like to enquire about your services.

Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Company: ${company || 'Not provided'}
Requirement: ${requirement}
Project Type: ${projectType || 'Not specified'}

Requirement Details:
${message}

Thank you.`;

  };


  const createWhatsAppURL = (whatsappMessage) => {
    const whatsappURL =
      `https://wa.me/919421498382?text=${encodeURIComponent(whatsappMessage)}`;

    return whatsappURL;
  };


  /* =========================
     OPEN WHATSAPP
  ========================== */

  const openWhatsApp = () => {

    const whatsappMessage =
      createWhatsAppMessage();

    const whatsappURL =
      createWhatsAppURL(whatsappMessage);

    window.open(
      whatsappURL,
      '_blank',
      'noopener,noreferrer'
    );

  };


  /* =========================
     FORM SUBMISSION
  ========================== */

  let isSubmitting = false;

  form.addEventListener('submit', async (event) => {

    event.preventDefault();

    if (isSubmitting) return;

    if (feedback) {
      feedback.textContent = '';
    }

    if (feedbackActions) {
      feedbackActions.hidden = true;
    }

    if (successState) {
      successState.hidden = true;
    }


    /* VALIDATE */

    if (!validateForm()) {
      return;
    }


    /* PREVENT DUPLICATE SUBMISSION */

    isSubmitting = true;

    setLoading(true);


    /* FORM VALUES */

    const name =
      document.getElementById('fromName')
        .value.trim();

    const phone =
      document.getElementById('phone')
        .value.trim();

    const email =
      document.getElementById('email')
        .value.trim();

    const company =
      document.getElementById('company')
        ?.value.trim() || '';

    const requirement =
      document.getElementById('requirementType')
        .value.trim();

    const projectType =
      document.getElementById('projectType')
        ?.value.trim() || '';

    const message =
      document.getElementById('message')
        .value.trim();

    const contactMethod =
      document.querySelector(
        'input[name="contact_method"]:checked'
      )?.value || 'Phone Call';

    const consentStatus =
      document.getElementById('consent')?.checked
        ? 'Agreed'
        : 'Not Agreed';


    /* SUBJECT */

    const subject =
      `New Solar Enquiry - ${requirement} - ${name}`;


    /* HIDDEN FIELDS */

    const submissionDate =
      document.getElementById('submissionDate');

    const pageUrl =
      document.getElementById('pageUrl');

    const emailSubject =
      document.getElementById('emailSubject');

    if (submissionDate) {

      submissionDate.value =
        new Date().toLocaleString(
          'en-IN',
          {
            dateStyle: 'medium',
            timeStyle: 'short'
          }
        );

    }

    if (pageUrl) {
      pageUrl.value = window.location.href;
    }

    if (emailSubject) {
      emailSubject.value = subject;
    }


    /* =========================
       WHATSAPP WINDOW
       Open immediately to avoid
       browser popup blocking.
    ========================== */

    let whatsappWindow = null;

    if (contactMethod === 'WhatsApp') {

      whatsappWindow =
        window.open(
          'about:blank',
          '_blank'
        );

    }


    try {

      /* CONFIG CHECK */

      if (!isConfigured()) {
        throw new Error(
          'EmailJS credentials are not configured.'
        );
      }


      /* EMAILJS CHECK */

      initializeEmailJS();


      /* =========================
         EMAILJS TEMPLATE DATA
      ========================== */

      const templateParams = {

        name: name || 'Not provided',

        email: email || 'Not provided',

        phone: phone || 'Not provided',

        subject: subject || 'New Solar Enquiry',

        message: `
NEW ENQUIRY - VAISHALI ELECTRICALS & SOLAR

Full Name:
${name || 'Not provided'}

Phone:
${phone || 'Not provided'}

Email:
${email || 'Not provided'}

Company:
${company || 'Not provided'}


Requirement Type:
${requirement || 'Not specified'}

Project Type:
${projectType || 'Not specified'}

Product:
${productField?.value || 'Not specified'}

Contact Preference:
${contactMethod || 'Not specified'}


${message || 'Not provided'}

Consent:
${consentStatus}


Submission Date:
${submissionDate?.value || new Date().toLocaleString('en-IN')}

Page URL:
${window.location.href}

Source:
Website Contact Page

Subject:
${subject || 'New Solar Enquiry'}

`,

        source: 'Website Contact Page',

      };


      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );


      if (feedback) {

        feedback.textContent =
          'Thank you! Your message has been sent successfully. We will contact you shortly.';

        feedback.style.color =
          '#1f7a1f';

      }


      /* =========================
         WHATSAPP
      ========================== */

      if (contactMethod === 'WhatsApp') {

        const whatsappMessage =
          createWhatsAppMessage();

        const whatsappURL =
          createWhatsAppURL(whatsappMessage);


        if (
          whatsappWindow &&
          !whatsappWindow.closed
        ) {

          whatsappWindow.location.href =
            whatsappURL;

        } else {

          /* Fallback if browser blocked popup */

          window.open(
            whatsappURL,
            '_blank',
            'noopener,noreferrer'
          );

        }

      }


      /* RESET ONLY AFTER SUCCESS */

      form.reset();


      if (successState) {
        successState.hidden = false;
      }

      if (feedbackActions) {
        feedbackActions.hidden = true;
      }


    } catch (error) {

      console.error('EmailJS submission error:', {
        status: error?.status,
        text: error?.text,
        error
      });


      /* CLOSE EMPTY WHATSAPP WINDOW */

      if (
        whatsappWindow &&
        !whatsappWindow.closed
      ) {

        whatsappWindow.close();

      }


      if (feedback) {

        feedback.textContent =
          'Sorry, something went wrong while sending your message. Please try again.';

        feedback.style.color =
          '#b42318';

      }

      if (feedbackActions) {
        feedbackActions.hidden = false;
      }

    } finally {

      isSubmitting = false;

      setLoading(false);

    }

  });


  /* =========================
     TRY AGAIN
  ========================== */

  tryAgainButton?.addEventListener(
    'click',
    () => {

      if (feedback) {
        feedback.textContent = '';
      }

      if (feedbackActions) {
        feedbackActions.hidden = true;
      }

      if (successState) {
        successState.hidden = true;
      }

      document
        .getElementById('fromName')
        ?.focus();

    }
  );


  /* =========================
     LIVE VALIDATION
  ========================== */

  form
    .querySelectorAll(
      'input, select, textarea'
    )
    .forEach((field) => {

      field.addEventListener(
        'input',
        () => {

          if (
            field.classList.contains(
              'is-invalid'
            )
          ) {

            validateForm();

          }

        }
      );


      field.addEventListener(
        'change',
        () => {

          if (
            field.classList.contains(
              'is-invalid'
            )
          ) {

            validateForm();

          }

        }
      );

    });

});