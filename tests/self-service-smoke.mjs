// Dependency-free browser rendering/API wiring smoke test; no demo fixture is shipped to the website.
import assert from 'node:assert/strict';
const nodes={},listeners={}, calls=[];
const db={
 me:{id:'member-1',name:'New Registered Member',email:'member@company.test',title:'Member',role:'MEMBER',color:'violet',enabled:true},
 projects:[], members:[{id:'member-1',name:'New Registered Member',email:'member@company.test',title:'Member',role:'MEMBER',color:'violet',enabled:true}],
 memberships:[],tasks:[],activities:[],comments:[]
};
let seq=0;const uid=()=>`generated-${++seq}`;
const response=(body,status=200)=>({ok:status>=200&&status<300,status,redirected:false,url:'http://localhost:8080',json:async()=>structuredClone(body)});
global.fetch=async(path,options={})=>{
 const route=String(path);const method=options.method||'GET';const body=options.body?JSON.parse(options.body):{};
 calls.push(`${method} ${route}`);
 if(route==='/api/auth/csrf')return response({token:'XSRF-TEST',headerName:'X-XSRF-TOKEN'});
 if(route==='/api/bootstrap')return response(db);
 if(route==='/api/projects'&&method==='POST'){
  const project={...body,id:uid(),leadId:db.me.id,createdAt:new Date().toISOString()};
  db.projects.push(project);db.memberships.push({id:uid(),projectId:project.id,memberId:db.me.id,projectRole:'LEAD'});return response(project);
 }
 if(route==='/api/members'&&method==='POST'){
  const {password,...user}=body;const m={...user,id:uid(),enabled:true};db.members.push(m);return response(m);
 }
 if(/^\/api\/projects\/.+\/members$/.test(route)&&method==='PUT'){
  const pid=route.split('/')[3];db.memberships=db.memberships.filter(m=>m.projectId!==pid);
  for(const mid of body.memberIds)db.memberships.push({id:uid(),projectId:pid,memberId:mid,projectRole:'CONTRIBUTOR'});
  return response(db.memberships.filter(m=>m.projectId===pid));
 }
 if(/^\/api\/projects\/.+\/members\/invite$/.test(route)&&method==='POST'){
  const pid=route.split('/')[3];const invitee=db.members.find(x=>x.email.toLowerCase()===body.email.toLowerCase());if(!invitee)return response({error:'Registered account not found'},404);db.memberships.push({id:uid(),projectId:pid,memberId:invitee.id,projectRole:'CONTRIBUTOR'});return response(db.memberships.filter(x=>x.projectId===pid));
 }
 if(route==='/api/tasks'&&method==='POST'){
  const proj=db.projects.find(p=>p.id===body.projectId);const t={...body,id:uid(),key:`${proj.key}-101`,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),position:0,version:0,creatorId:db.me.id,assigneeId:body.assigneeId||null};db.tasks.push(t);return response(t);
 }
 if(/^\/api\/tasks\/.+\/status$/.test(route)&&method==='PATCH'){
  const t=db.tasks.find(x=>x.id===route.split('/')[3]);if(body.version!==t.version)return response({error:'Task changed since you opened it'},409);t.status=body.status;t.version+=1;return response(t);
 }
 if(/^\/api\/tasks\/.+\/comments$/.test(route)&&method==='POST'){
  const c={id:uid(),taskId:route.split('/')[3],authorId:db.me.id,body:body.body,createdAt:new Date().toISOString()};db.comments.push(c);return response(c);
 }
 if(/^\/api\/tasks\//.test(route)&&method==='PATCH'){
  const t=db.tasks.find(x=>x.id===route.split('/')[3]);Object.assign(t,body);return response(t);
 }
 if(route==='/api/account/password'&&method==='POST')return response({message:'Password changed'});
 if(/^\/api\/projects\//.test(route)&&method==='DELETE'){
  const pid=route.split('/')[3];db.projects=db.projects.filter(x=>x.id!==pid);db.tasks=db.tasks.filter(x=>x.projectId!==pid);db.memberships=db.memberships.filter(x=>x.projectId!==pid);return response(null,204);
 }
 throw new Error(`Unexpected mocked backend call: ${method} ${route}`);
};
global.document={
 getElementById(id){return nodes[id]??(nodes[id]={innerHTML:'',value:'',focus(){},addEventListener(){}})},
 addEventListener(name,cb){listeners[name]=cb},
 querySelector(){return null},querySelectorAll(){return []},
 createElement(){return {innerHTML:'',className:'',remove(){},click(){}}},
 body:{append(){}},title:''
};
global.window={addEventListener(){},history:{pushState(){}}};
global.location={search:'',protocol:'http:',hash:'',href:'',reload(){}};
global.FormData=class{constructor(form){this.fields=form.fields||[]} entries(){return this.fields.values()} getAll(n){return this.fields.filter(x=>x[0]===n).map(x=>x[1])}};
nodes.toasts={append(){}};
await import('../backend/src/main/resources/static/js/app.js');
await new Promise(resolve=>setTimeout(resolve,60));
const click=(action,attrs={})=>{const el={dataset:{action,...attrs}};listeners.click({target:{closest(){return el}}});};
const submit=(id,fields={},attrs={})=>{
 const items=Object.entries(fields);const form={id,dataset:attrs,fields:items};
 listeners.submit({target:form,preventDefault(){}});
};
const settle=()=>new Promise(resolve=>setTimeout(resolve,40));
const html=()=>nodes.app.innerHTML;
assert.match(html(),/Welcome to Tasky/);
assert.match(html(),/Create your first project/);
assert.doesNotMatch(html(),/Ask a project lead or workspace administrator/);
click('nav',{page:'my-tasks'});
assert.match(html(),/Create project/);
click('modal-task');
assert.match(nodes.overlays.innerHTML,/Create a project/);
submit('new-project-form',{name:'Member Project',key:'MEMP',description:'Private workflow',status:'ACTIVE',color:'indigo',startDate:'',targetDate:''});
await settle();
assert.equal(db.projects.length,1);
assert.equal(db.projects[0].leadId,'member-1');
assert.equal(db.memberships[0].memberId,'member-1');
assert.match(html(),/Member Project/);
click('modal-task');assert.match(nodes.overlays.innerHTML,/Create a task/);
submit('new-task-form',{title:'My first task',projectId:db.projects[0].id,status:'TODO',priority:'MEDIUM',category:'Feature',description:'Independent work',assigneeId:'member-1',dueDate:''});
await settle();
assert.equal(db.tasks.length,1);
assert.match(html(),/My first task/);
click('nav',{page:'my-tasks'});
assert.match(html(),/My first task/);
click('project',{id:db.projects[0].id});
click('modal-members');
assert.match(nodes.overlays.innerHTML,/Add a registered teammate by email/);
assert.match(nodes.overlays.innerHTML,/invite-project-member-form/);
db.members.push({id:'member-2',name:'Second Registered Member',email:'member2@company.test',role:'MEMBER',color:'teal',enabled:true});
submit('invite-project-member-form',{email:'member2@company.test'},{id:db.projects[0].id});
await settle();
assert.equal(db.memberships.length,2);
assert.ok(calls.includes('POST /api/projects/'+db.projects[0].id+'/members/invite'));
console.log('PASS: newly registered member can create projects/tasks and invite teammates without admin approval');
