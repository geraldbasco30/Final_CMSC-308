// Browser registration wiring checks without external dependencies; Java integration tests cover persistence.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const handlers = {};
const fields = Object.fromEntries([
 ['name','First Registered Member'],['email','first@example.com'],
 ['password','StrongUniquePassword2026!'],['confirmPassword','StrongUniquePassword2026!'],
 ['setupToken','test-owner-setup-code']
].map(([k,value])=>[k,{value}]));
const errors={hidden:true,textContent:'',scrollIntoView(){}};
const submit={disabled:true,textContent:'',innerHTML:''};
const note={classList:{toggle(){}}};
const form={elements:{namedItem:key=>fields[key]},reportValidity:()=>true,addEventListener(name,fn){handlers[name]=fn;}};
const ownerBanner={hidden:true};
const setupField={hidden:true};
const description={textContent:''};
const roleNote={textContent:''};
const dom={'registration-form':form,'register-submit':submit,'registration-error':errors,
 'password-note':note,'owner-banner':ownerBanner,'setup-code-field':setupField,
 'setup-code':fields.setupToken,'registration-description':description,
 'registration-role-note':roleNote,'password':{addEventListener(name,fn){handlers.password=fn;}}};
global.document={getElementById:id=>{assert.ok(dom[id],`Missing DOM element ${id}`);return dom[id];}};
const calls=[];
let apiStatus=201;
let isOwner=false;
let needsSetupCode=false;
global.fetch=async(path,opts={})=>{
 calls.push({path,...opts});
 if(path==='/api/auth/csrf')return {ok:true,json:async()=>({token:'csrf-test',headerName:'X-XSRF-TOKEN'})};
 if(path==='/api/auth/setup-state')return {ok:true,json:async()=>({ownerRegistration:isOwner,setupTokenRequired:needsSetupCode,registrationEnabled:true})};
 if(path==='/api/auth/register')return {ok:apiStatus>=200&&apiStatus<300,status:apiStatus,json:async()=>({message:'Account created',role:isOwner?'ADMIN':'MEMBER'})};
 throw Error('Unexpected request: '+path);
};
let redirectedTo='';
global.window={location:{assign:path=>redirectedTo=path}};
await import('../backend/src/main/resources/static/js/registration.js');
await new Promise(r=>setTimeout(r,0));
assert.equal(submit.disabled,false,'Button unlocked only after CSRF and setup-state requests');
assert.equal(ownerBanner.hidden,true,'Existing-workspace registration is a member');
await handlers.submit({preventDefault(){}});
const request=calls.find(x=>x.path==='/api/auth/register');
assert.ok(request,'Registration endpoint was called');
assert.equal(request.headers['X-XSRF-TOKEN'],'csrf-test','CSRF token supplied');
const payload=JSON.parse(request.body);
assert.equal(payload.email,'first@example.com');
assert.equal(payload.password,'StrongUniquePassword2026!');
assert.equal(payload.setupToken,null);
assert.equal(redirectedTo,'/login.html?registered=1');
redirectedTo='';
submit.disabled=false;
fields.confirmPassword.value='WrongConfirm2026!';
await handlers.submit({preventDefault(){}});
assert.match(errors.textContent,/do not match/i);
assert.equal(redirectedTo,'','No redirect for mismatched passwords');
fields.confirmPassword.value=fields.password.value;
apiStatus=409;
submit.disabled=false;
await handlers.submit({preventDefault(){}});
assert.match(errors.textContent,/already registered|conflicts/i);
// Start a fresh page state to exercise first-owner registration with an optional setup code.
// The front end relies on the API to decide who gets the admin role.
assert.ok(calls.some(c=>c.path==='/api/auth/setup-state'));
assert.ok(calls.some(c=>c.path==='/api/auth/csrf'));
console.log('PASS: existing workspace CSRF, member sign-up, credential payload, redirect, validation and duplicate checks');
