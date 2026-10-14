// Run the actual Tasky browser application script in an isolated VM for every case.
// The bootstrap payloads intentionally include incomplete display names to reproduce
// the old report-screen crash with no Spring Boot or network problem.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const id='proj-100';
const project={id,name:'Production Project',key:'PROD',leadId:'owner',description:'',status:'ACTIVE',color:'violet',createdAt:'2026-10-11T01:00:00Z'};
function fixture({ownerName='Workspace Owner',memberName=null,projectKey='PROD'}={}) {
 return {
  me:{id:'owner',name:ownerName,role:'ADMIN',color:'violet',enabled:true,email:'owner@example.test'},
  projects:[{...project,key:projectKey}],
  members:[{id:'owner',name:ownerName,role:'ADMIN',enabled:true,color:'violet',email:'owner@example.test'},
           {id:'teammate',name:memberName,role:'MEMBER',enabled:true,color:'indigo',email:'teammate@example.test'}],
  memberships:[{id:'m1',projectId:id,memberId:'owner',projectRole:'LEAD'},
               {id:'m2',projectId:id,memberId:'teammate',projectRole:'CONTRIBUTOR'}],
  tasks:[],activities:[],comments:[]
 };
}
const source=fs.readFileSync(new URL('../backend/src/main/resources/static/js/app.js',import.meta.url),'utf8');
assert.match(source,/\nload\(\);\s*$/);
async function boot(hash, payload){
 const nodes={},listeners={};
 const context={
  console:{error(){}},
  AbortController, setTimeout, clearTimeout, Date,
  fetch:async url=>{
   if(String(url)==='/api/bootstrap')return {ok:true,status:200,redirected:false,json:async()=>payload};
   if(String(url)==='/api/auth/csrf')return {ok:true,status:200,redirected:false,json:async()=>({token:'csrf'})};
   throw new Error('Unexpected URL '+url);
  },
  document:{getElementById:k=>nodes[k]??(nodes[k]={innerHTML:'',addEventListener(n,cb){listeners[k+':'+n]=cb}}),addEventListener:(n,f)=>listeners[n]=f},
  window:{addEventListener(){},history:{pushState(){}}},
  location:{hash,href:'',reload(){}},
 };
 vm.runInNewContext(source.replace(/\nload\(\);\s*$/, '\nglobalThis.__boot=load();'),context,{filename:'Tasky/app.js'});
 await context.__boot;
 return {html:nodes.app?.innerHTML||'',listeners};
}
const scenarios=[
 {name:'project reports',hash:`#project/${id}/project-reports`,payload:fixture(),expect:/Project analytics/},
 {name:'workspace reports',hash:'#reports',payload:fixture({memberName:''}),expect:/Analytics &amp; reports/},
 {name:'overview',hash:'#overview',payload:fixture({ownerName:null}),expect:/Hello, owner/},
 {name:'project overview',hash:`#project/${id}/project-overview`,payload:fixture(),expect:/About this project/},
 {name:'My Tasks',hash:'#my-tasks',payload:fixture(),expect:/My tasks/},
];
for(const caseDef of scenarios){
 const result=await boot(caseDef.hash,caseDef.payload);
 assert.match(result.html,caseDef.expect,caseDef.name);
 assert.doesNotMatch(result.html,/Unable to connect to Tasky|Tasky could not display this page/,caseDef.name);
}
// A page-level crash must no longer be misreported as an offline server.
const broken=await boot('#projects',fixture({projectKey:null}));
assert.match(broken.html,/Tasky could not display this page/);
assert.doesNotMatch(broken.html,/Unable to connect to Tasky/);
assert.equal(typeof broken.listeners['go-overview:click'],'function');
console.log('PASS: reports, overview and tasks tolerate missing names; page errors are distinct from connection errors');
