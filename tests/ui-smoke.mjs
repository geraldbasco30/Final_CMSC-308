// Dependency-free browser rendering/API wiring smoke test; no demo fixture is shipped to the website.
import assert from 'node:assert/strict';
const nodes={},listeners={}, calls=[];
const db={
 me:{id:'admin-1',name:'Workspace Administrator',email:'admin@company.test',title:'Administrator',role:'ADMIN',color:'indigo',enabled:true},
 projects:[], members:[{id:'admin-1',name:'Workspace Administrator',email:'admin@company.test',title:'Administrator',role:'ADMIN',color:'indigo',enabled:true}],
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
assert.ok(!html().includes('Website redesign'),'No sample projects in live UI');
click('modal-project');assert.match(nodes.overlays.innerHTML,/Create a project/);
submit('new-project-form',{name:'Operations',key:'OPS',description:'Company workflow',status:'ACTIVE',color:'indigo',startDate:'',targetDate:''});
await settle();
assert.equal(db.projects.length,1);
assert.match(html(),/kanban-board/);
click('nav',{page:'projects'});assert.match(html(),/Operations/);
click('nav',{page:'team'});assert.match(html(),/Workspace Administrator/);
click('modal-member');assert.match(nodes.overlays.innerHTML,/Add a team member/);
submit('new-member-form',{name:'Release Engineer',email:'release@company.test',role:'MEMBER',title:'Engineer',password:'ValidStrongPassword123!'});
await settle();assert.equal(db.members.length,2);
const pid=db.projects[0].id, mid=db.members[1].id;
click('project',{id:pid});click('modal-members');
assert.match(nodes.overlays.innerHTML,/Release Engineer/);
submit('project-members-form',{memberId:mid});await settle();
click('modal-task');assert.match(nodes.overlays.innerHTML,/Create a task/);
submit('new-task-form',{title:'Prepare release checklist',projectId:pid,status:'TODO',priority:'HIGH',category:'Development',description:'Prepare release',assigneeId:mid,dueDate:''});
await settle();
assert.equal(db.tasks.length,1);assert.match(html(),/Prepare release checklist/);
// A task created by me and assigned to a colleague should still appear in My tasks.
click('nav',{page:'my-tasks'});
assert.match(html(),/Prepare release checklist/);
assert.match(html(),/Created by me/);
assert.match(html(),/Created by you|Created by me/);
assert.match(html(),/Assigned to me/);
const myFilter={id:'my-filter',value:'CREATED'};
listeners.change({target:myFilter});
assert.match(html(),/Prepare release checklist/);
click('modal-task');
assert.match(nodes.overlays.innerHTML,/Create a task/);
assert.match(nodes.overlays.innerHTML,new RegExp('value=\"'+db.me.id+'\" selected'));
click('close-modal');
click('project',{id:pid});
listeners.drop({target:{closest(){return {dataset:{status:'DONE'}}}},preventDefault(){},dataTransfer:{getData(){return db.tasks[0].id}}});
await settle();assert.equal(db.tasks[0].status,'DONE');
// A finished task must be movable back to To Do.
listeners.drop({target:{closest(){return {dataset:{status:'TODO'}}}},preventDefault(){},dataTransfer:{getData(){return db.tasks[0].id}}});
await settle();assert.equal(db.tasks[0].status,'TODO');
// A new To Do task must be creatable after another task has been completed.
click('modal-task',{status:'TODO'});
submit('new-task-form',{title:'Follow-up task after completion',projectId:pid,status:'TODO',priority:'MEDIUM',category:'Feature',description:'Next action',assigneeId:'',dueDate:''});
await settle();assert.equal(db.tasks.length,2);assert.equal(db.tasks[1].status,'TODO');
click('open-task',{id:db.tasks[0].id});assert.match(nodes.overlays.innerHTML,/Prepare release checklist/);
click('detail-tab',{tab:'activity'});assert.match(nodes.overlays.innerHTML,/Activity/);
click('close-modal');click('board-view',{view:'list'});assert.match(html(),/data-table/);
click('subpage',{page:'project-overview'});assert.match(html(),/About this project/);
click('subpage',{page:'project-reports'});assert.match(html(),/Project analytics/);
click('subpage',{page:'settings'});assert.match(html(),/project-settings-form/);
click('nav',{page:'reports'});assert.match(html(),/Team productivity/);
click('nav',{page:'activity'});assert.match(html(),/Activity log/);
click('profile');assert.match(nodes.overlays.innerHTML,/Change password/);
click('change-password');assert.match(nodes.overlays.innerHTML,/password-form/);
submit('password-form',{currentPassword:'OldPassword123!',newPassword:'NewPasswordSecure123!',confirmPassword:'NewPasswordSecure123!'});
await settle();assert.ok(calls.includes('POST /api/account/password'));
console.log('PASS: clean onboarding, Java-backed CRUD wiring, projects, members, board/list, drag/drop, reports, settings and password action');
