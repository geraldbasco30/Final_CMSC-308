import assert from 'node:assert/strict';
const handlers={};
const fields=Object.fromEntries([
 ['name','Workspace Owner'],['email','owner@example.com'],['password','SecureWorkspaceOwner2026!'],
 ['confirmPassword','SecureWorkspaceOwner2026!'],['setupToken','super-secret-setup-code']
].map(([key,value])=>[key,{value}]));
const dom={
 'registration-form':{elements:{namedItem:key=>fields[key]},reportValidity:()=>true,addEventListener(k,fn){handlers[k]=fn;}},
 'register-submit':{disabled:true,textContent:'',innerHTML:''},
 'registration-error':{hidden:true,scrollIntoView(){},textContent:''},
 'password-note':{classList:{toggle(){}}},
 'password':{addEventListener(k,fn){handlers.password=fn;}},
 'owner-banner':{hidden:true},'setup-code-field':{hidden:true},
 'setup-code':fields.setupToken,
 'registration-description':{textContent:''},'registration-role-note':{textContent:''}
};
global.document={getElementById:id=>{assert.ok(dom[id],`Missing element: ${id}`);return dom[id];}};
let redirect='';let registration=null;
global.window={location:{assign:value=>{redirect=value;}}};
global.fetch=async(path,options={})=>{
 if(path==='/api/auth/csrf')return {ok:true,json:async()=>({token:'csrf-test',headerName:'X-XSRF-TOKEN'})};
 if(path==='/api/auth/setup-state')return {ok:true,json:async()=>({ownerRegistration:true,setupTokenRequired:true,registrationEnabled:true})};
 if(path==='/api/auth/register'){
  registration=JSON.parse(options.body);
  return {ok:true,status:201,json:async()=>({role:'ADMIN',message:'Account created'})};
 }
 throw Error('Unexpected call '+path);
};
await import('../backend/src/main/resources/static/js/registration.js');
await new Promise(r=>setTimeout(r,0));
assert.equal(dom['owner-banner'].hidden,false);
assert.equal(dom['setup-code-field'].hidden,false);
assert.equal(fields.setupToken.required,true);
assert.equal(dom['register-submit'].disabled,false);
await handlers.submit({preventDefault(){}});
assert.equal(registration.setupToken,'super-secret-setup-code');
assert.equal(redirect,'/login.html?registered=owner');
console.log('PASS: first account browser onboarding, optional setup code, owner registration redirect');
