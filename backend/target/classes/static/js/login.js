'use strict';
const params = new URLSearchParams(location.search);
if (params.has('error')) document.getElementById('login-error').hidden = false;
if (params.has('registered')) {
 const msg=document.getElementById('login-success');
 msg.textContent=params.get('registered')==='owner'
  ? 'Workspace created! Sign in with your new administrator account.'
  : 'Account created successfully. Sign in to continue.';
 msg.hidden=false;
}
if (params.has('logout')) document.getElementById('logout-success').hidden = false;
const signInButton = document.getElementById('login-submit');
fetch('/api/auth/csrf', {credentials:'same-origin',headers:{Accept:'application/json'}})
 .then(response => {
  if (!response.ok) throw new Error('Could not load security token');
  return response.json();
 })
 .then(data => {
  if (!data.token) throw new Error('Missing security token');
  document.getElementById('csrf').value = data.token;
  signInButton.disabled = false;
 })
 .catch(() => {
  const error = document.getElementById('login-error');
  error.textContent = 'Unable to initialize secure sign-in. Refresh the page.';
  error.hidden = false;
 });
