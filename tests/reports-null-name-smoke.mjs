import assert from 'node:assert/strict';
const nodes={},events={};
const id='proj-100';
const payload={
 me:{id:'owner',name:'Workspace Owner',role:'ADMIN',color:'violet',enabled:true,email:'owner@example.test'},
 projects:[{id,name:'Real Business Project',key:'RBP',leadId:'owner',description:'',status:'ACTIVE',color:'violet',createdAt:'2026-10-11T01:00:00Z'}],
 members:[{id:'owner',name:'Workspace Owner',role:'ADMIN',enabled:true,color:'violet',email:'owner@example.test'}, {id:'teammate',name:null,role:'MEMBER',enabled:true,color:'indigo',email:'teammate@example.test'}],
 memberships:[{id:'m1',projectId:id,memberId:'owner',projectRole:'LEAD'}, {id:'m2',projectId:id,memberId:'teammate',projectRole:'MEMBER'}],
 tasks:[],activities:[],comments:[]
};
const response=b=>({ok:true,status:200,redirected:false,json:async()=>b});
global.fetch=async url=>String(url)==='/api/bootstrap'?response(payload):String(url)==='/api/auth/csrf'?response({token:'token'}):Promise.reject(new Error('unexpected URL '+url));
global.document={getElementById:k=>nodes[k]??(nodes[k]={innerHTML:'',addEventListener() {}}),addEventListener:(n,f)=>events[n]=f};
global.window={addEventListener(){},history:{pushState(){}}};
global.location={hash:'#project/'+id+'/project-reports',href:'',reload(){}};
await import('../backend/src/main/resources/static/js/app.js');
await new Promise(r=>setTimeout(r,80));
assert.match(nodes.app.innerHTML,/Project analytics/,'Expected reports to render even with an incomplete member name');
assert.doesNotMatch(nodes.app.innerHTML,/Unable to connect to Tasky/);
assert.match(nodes.app.innerHTML,/Real Business Project/);
console.log('PASS: project reports render even when a member name is missing');
