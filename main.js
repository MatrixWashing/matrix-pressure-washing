/**
 * MATRIX Pressure Washing — Main JavaScript
 * Handles navigation, form validation, and UI interactions
 */

(function () {
  'use strict';

  /* --- Header scroll effect --- */
  const header = document.getElementById('header');

  function handleScroll() {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Mobile menu toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.hidden = true;
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    mobileMenu.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
    }
  });

  /* --- Smooth anchor scrolling offset fix --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --- Quote form validation & submission --- */
  const form = document.getElementById('quote-form');
  const successMessage = document.getElementById('form-success');

  function showError(input, message) {
    const group = input.closest('.form-group') || input.closest('fieldset');
    const errorEl = group.querySelector('.form-error');
    input.classList.add('form-input--error');
    errorEl.textContent = message;
  }

  function clearError(input) {
    const group = input.closest('.form-group') || input.closest('fieldset');
    const errorEl = group.querySelector('.form-error');
    input.classList.remove('form-input--error');
    errorEl.textContent = '';
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  }

  function validateZip(value) {
    return /^\d{5}$/.test(value);
  }

  form.querySelectorAll('.form-input').forEach(function (input) {
    input.addEventListener('input', function () {
      clearError(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    const fullName = form.querySelector('#full-name');
    const zipCode = form.querySelector('#zip-code');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const services = form.querySelectorAll('input[name="services"]:checked');

    [fullName, zipCode, phone, email].forEach(clearError);
    clearError(form.querySelector('fieldset'));

    if (!fullName.value.trim()) {
      showError(fullName, 'Please enter your full name.');
      isValid = false;
    }

    if (!validateZip(zipCode.value.trim())) {
      showError(zipCode, 'Please enter a valid 5-digit ZIP code.');
      isValid = false;
    }

    if (!validatePhone(phone.value.trim())) {
      showError(phone, 'Please enter a valid phone number.');
      isValid = false;
    }

    if (!email.value.trim() || !email.checkValidity()) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (services.length === 0) {
      const fieldset = form.querySelector('fieldset');
      const errorEl = fieldset.querySelector('.form-error');
      errorEl.textContent = 'Please select at least one service.';
      isValid = false;
    }

    if (!isValid) {
      const firstError = form.querySelector('.form-input--error, .form-error:not(:empty)');
      if (firstError) {
        (firstError.closest('.form-group') || firstError.closest('fieldset'))
          .querySelector('input, .checkbox')
          ?.focus();
      }
      return;
    }

    form.hidden = true;
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* --- Phone number formatting --- */
  const phoneInput = document.getElementById('phone');

  phoneInput.addEventListener('input', function () {
    let digits = this.value.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;

    if (digits.length >= 6) {
      formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
    } else if (digits.length >= 3) {
      formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
    } else if (digits.length > 0) {
      formatted = '(' + digits;
    }

    this.value = formatted;
  });

})();
