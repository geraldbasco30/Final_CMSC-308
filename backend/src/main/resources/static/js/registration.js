'use strict';
// Self-service registration. All permissions and input validation are enforced again on the Java server.
const form = document.getElementById('registration-form');
const submit = document.getElementById('register-submit');
const error = document.getElementById('registration-error');
const passwordNote = document.getElementById('password-note');
let token = '';
let csrfHeader = 'X-XSRF-TOKEN';
let ownerRegistration = false;
let setupTokenRequired = false;

function showError(message) {
 error.textContent = message;
 error.hidden = false;
 error.scrollIntoView({block:'nearest',behavior:'smooth'});
}

async function initSecurity() {
 try {
  const response = await fetch('/api/auth/csrf', {credentials:'same-origin',headers:{Accept:'application/json'}});
  if (!response.ok) throw new Error('Could not initialize secure registration. Refresh this page.');
  const csrf = await response.json();
  if (!csrf.token || !csrf.headerName) throw new Error('Security token was missing. Refresh this page.');
  token = csrf.token;
  csrfHeader = csrf.headerName;
  const stateResponse = await fetch('/api/auth/setup-state', {credentials:'same-origin',headers:{Accept:'application/json'}});
  if (!stateResponse.ok) throw new Error('Could not check workspace setup. Refresh the page.');
  const state = await stateResponse.json();
  ownerRegistration = Boolean(state.ownerRegistration);
  setupTokenRequired = Boolean(state.setupTokenRequired && ownerRegistration);
  document.getElementById('owner-banner').hidden = !ownerRegistration;
  document.getElementById('setup-code-field').hidden = !setupTokenRequired;
  document.getElementById('setup-code').required = setupTokenRequired;
  if (ownerRegistration) {
   document.getElementById('registration-description').textContent = 'Create your administrator account to open your new workspace.';
   document.getElementById('registration-role-note').textContent = 'Your first account will own this workspace. All later registrations receive Member access.';
  }
  if (state.registrationEnabled === false) throw new Error('Registration is disabled for this workspace.');
  submit.disabled = false;
 } catch (cause) {
  showError(cause.message || 'Cannot connect to Tasky. Please refresh and try again.');
 }
}

document.getElementById('password').addEventListener('input', event => {
 const value = event.target.value;
 const bytes = new TextEncoder().encode(value).length;
 passwordNote.classList.toggle('password-valid', value.length >= 12 && bytes <= 72);
});

form.addEventListener('submit', async event => {
 event.preventDefault();
 if (submit.disabled || !form.reportValidity()) return;
 error.hidden = true;
 const name = form.elements.namedItem('name').value.trim();
 const email = form.elements.namedItem('email').value.trim();
 const password = form.elements.namedItem('password').value;
 const confirmPassword = form.elements.namedItem('confirmPassword').value;
 const setupToken = form.elements.namedItem('setupToken').value;
 if (name.length < 2) return showError('Enter a name with at least 2 characters.');
 if (password.length < 12 || new TextEncoder().encode(password).length > 72)
  return showError('Use a password with at least 12 characters and at most 72 UTF-8 bytes.');
 if (password !== confirmPassword) return showError('The passwords do not match.');
 submit.disabled = true;
 submit.textContent = 'Creating account…';
 try {
  const response = await fetch('/api/auth/register', {
   method:'POST',credentials:'same-origin',
   headers:{'Content-Type':'application/json',Accept:'application/json',[csrfHeader]:token},
   body:JSON.stringify({name,email,password,confirmPassword,setupToken:setupTokenRequired?setupToken:null})
  });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) {
   if(response.status === 409) throw new Error(data.error || 'This email is already registered. Please sign in or use a different email.');
   if(response.status === 403) throw new Error(data.error || 'Registration or workspace setup is not authorized.');
   if(response.status === 429) throw new Error('Too many attempts. Please try again later.');
   if(response.status === 400) throw new Error(data.error || 'Please check your details and try again.');
   throw new Error(data.error || `Registration failed (${response.status}). Please try again.`);
  }
  // Sign-in remains a separate authenticated step; no permissions are granted by the browser.
  window.location.assign(data.role === 'ADMIN' ? '/login.html?registered=owner' : '/login.html?registered=1');
 } catch (cause) {
  showError(cause.message || 'We could not create your account. Try again.');
  submit.disabled = false;
  submit.innerHTML = 'Create account <span>→</span>';
 }
});

initSecurity();
