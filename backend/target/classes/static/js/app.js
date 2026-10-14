const STATUS=[['TODO','TO DO'],['IN_PROGRESS','IN PROGRESS'],['REVIEW','IN REVIEW'],['DONE','DONE']];
const STATUS_NAMES=Object.fromEntries(STATUS);
const PRIORITIES=['LOW','MEDIUM','HIGH','URGENT'];
const COLORS={TODO:'#aeb7c7',IN_PROGRESS:'#7468ec',REVIEW:'#f0ac67',DONE:'#4fc49e'};
const iconPaths={
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  circle:'<circle cx="12" cy="12" r="9"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  board:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 4 2 5-7"/>',
  pie:'<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M21 9a9 9 0 0 0-9-9v9z"/>',
  pulse:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.9l.05.05-1.8 1.8-.05-.05a1.7 1.7 0 0 0-1.9-.34 1.7 1.7 0 0 0-1 1.56V21h-2.5v-.08A1.7 1.7 0 0 0 11.4 19a1.7 1.7 0 0 0-1.9.34l-.05.05-1.8-1.8.05-.05A1.7 1.7 0 0 0 8 15.6 1.7 1.7 0 0 0 6.4 14.6H6v-2.5h.4A1.7 1.7 0 0 0 8 11.1 1.7 1.7 0 0 0 7.7 9.2l-.05-.05 1.8-1.8.05.05a1.7 1.7 0 0 0 1.9.34A1.7 1.7 0 0 0 12.4 6V5h2.5v1a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.9-.34l.05-.05 1.8 1.8-.05.05a1.7 1.7 0 0 0-.34 1.9A1.7 1.7 0 0 0 21 12v2.5a1.7 1.7 0 0 0-1.6.5Z" transform="translate(-1.3 -.8) scale(.98)"/>',
  search:'<circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  chevronDown:'<path d="m6 9 6 6 6-6"/>',
  chevronRight:'<path d="m9 18 6-6-6-6"/>',
  chevronLeft:'<path d="m15 18-6-6 6-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',
  arrowUp:'<path d="m12 19 0-14m-6 6 6-6 6 6"/>',
  arrows:'<path d="m7 17 5-5 5 5M12 12V3M7 7 3 11M3 11v7M3 18h6"/>',
  flag:'<path d="M5 21V5m0 0c4-3 7 3 11 0v11c-4 3-7-3-11 0"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
  sparkles:'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 17l.6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6L19 17Z"/>',
  edit:'<path d="M12 20h9M15.5 4.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  download:'<path d="M12 3v13m-5-5 5 5 5-5M4 18v3h16v-3"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 1 1 5 2.5c-1.3.8-2.1 1.5-2.1 3M12 18h.01"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  message:'<path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.4-4.4A8.9 8.9 0 1 1 21 11.5Z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  external:'<path d="M12 5h7v7M19 5 9 15"/><path d="M19 14v5H5V5h6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>'
};
const I=(name,cls='')=>`<span class="icon ${cls}" aria-hidden="true"><svg viewBox="0 0 24 24">${iconPaths[name]||iconPaths.circle}</svg></span>`;
const E=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const A=(v)=>E(v);
const cap=(v)=>String(v||'').replaceAll('_',' ').toLowerCase().replace(/\b\w/g,x=>x.toUpperCase());
// Historical/imported accounts may have a missing display name. Never let a
// single incomplete member profile take down Reports, Overview, or Workload.
const displayName=(person)=>{
 const name=typeof person?.name==='string'?person.name.trim():'';
 if(name)return name;
 const email=typeof person?.email==='string'?person.email.trim():'';
 const local=email.includes('@')?email.split('@')[0]:'';
 return local||'Unnamed member';
};
const firstName=(person)=>displayName(person).split(/\s+/)[0];
const initials=(name)=>String(name||'?').split(/\s+/).slice(0,2).map(p=>p[0]||'').join('').toUpperCase();
const avatar=(u,size='')=>u?`<span class="avatar avatar-${E(u.color||'indigo')} ${size}" title="${A(displayName(u))}">${E(initials(displayName(u)))}</span>`:`<span class="avatar avatar-more ${size}" title="Unassigned">${I('user','i14')}</span>`;
const who=(id)=>data.members.find(x=>x.id===id);
const prj=(id)=>data.projects.find(x=>x.id===id);
const taskById=(id)=>data.tasks.find(x=>x.id===id);
const dt=(s,opt={month:'short',day:'numeric'})=>s?new Date(s.length===10?s+'T12:00:00':s).toLocaleDateString('en-US',opt):'—';
const ago=(d)=>{if(!d)return 'recently';const diff=Date.now()-new Date(d).getTime();if(diff<60000)return 'just now';if(diff<3600000)return `${Math.max(1,Math.floor(diff/60000))}m ago`;if(diff<86400000)return `${Math.floor(diff/3600000)}h ago`;if(diff<604800000)return `${Math.floor(diff/86400000)}d ago`;return dt(d);};
const overdue=t=>t.dueDate&&t.status!=='DONE'&&t.dueDate<dateToday();
const metrics=(ts)=>{const count=ts.length,done=ts.filter(t=>t.status==='DONE').length;return{count,done,inProgress:ts.filter(t=>t.status==='IN_PROGRESS').length,review:ts.filter(t=>t.status==='REVIEW').length,todo:ts.filter(t=>t.status==='TODO').length,overdue:ts.filter(overdue).length,completion:count?Math.round(done/count*100):0};};
const colorFor=(status)=>COLORS[status]||COLORS.TODO;
const memberIds=(pid)=>new Set(data.memberships.filter(m=>m.projectId===pid).map(m=>m.memberId));
const membersFor=(pid)=>{const ids=memberIds(pid);return data.members.filter(m=>ids.has(m.id)&&m.enabled);};
// Global account administration stays restricted, but creating a project is open to every signed-in user.
const canManage=()=>['ADMIN','MANAGER'].includes(data.me.role);
const canCreateProject=()=>Boolean(data.me?.enabled);
const isManagerOf=(p)=>Boolean(p)&&(canManage()||p.leadId===data.me.id);
const projectTasks=(id)=>data.tasks.filter(t=>t.projectId===id);
const allTasks=()=>data.tasks.filter(t=>Boolean(prj(t.projectId)));
// My work includes tasks assigned to the signed-in user AND tasks created by them.
// Do not silently lose unassigned tasks created by a user.
const myWorkTasks=()=>allTasks().filter(t=>t.assigneeId===data.me.id||t.creatorId===data.me.id);
const sortActivity=(acts)=>[...acts].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
const dateToday=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);};

let data={me:null,projects:[],members:[],memberships:[],tasks:[],activities:[],comments:[]};
let csrfToken='';
// Abort stalled HTTP requests instead of leaving the initial loading screen visible forever.
async function fetchWithTimeout(url, options={}, timeoutMs=15000){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try {return await fetch(url,{...options,signal:controller.signal,cache:'no-store'});}
 catch(error){if(error?.name==='AbortError')throw new Error(`Tasky server did not respond within ${Math.round(timeoutMs/1000)} seconds. Check the Spring Boot terminal, then retry.`);throw error;}
 finally {clearTimeout(timer);}
}

const state={page:'overview',projectId:null,view:'board',modal:null,detailTab:'comments',filterPriority:'ALL',filterMember:'ALL',search:'',globalSearch:'',notice:false,mobileMenu:false,myFilter:'ALL'};
async function getCsrf(){
 const r=await fetchWithTimeout('/api/auth/csrf',{credentials:'same-origin',headers:{Accept:'application/json'}});
 if(!r.ok)throw new Error('Security token could not be initialized');
 const x=await r.json();csrfToken=x.token;
}
function startupError(err,stage='connection'){
 console.error(`Tasky ${stage} error`,err);
 const renderError=stage==='render';
 const title=renderError?'Tasky could not display this page':'Unable to connect to Tasky';
 const explanation=renderError
  ?'Your workspace was received, but a page encountered an unexpected display error. Your saved data has not been reset. Try reloading or return to Overview.'
  :'The server could not load your workspace. No sample data has been substituted. Check that Spring Boot is running, then try again.';
 document.getElementById('app').innerHTML=`<main class="startup-screen"><div class="startup-card"><div class="logo"><span class="mark">✳</span><span>tasky<span class="brand-dot">.</span></span></div><div class="startup-icon">${I('alert','i24')}</div><h1>${title}</h1><p>${explanation}</p><div class="startup-message">${E(err?.message||'Unexpected error')}</div><div class="startup-actions"><button class="btn primary" id="retry-startup">${I('arrows')} ${renderError?'Retry page':'Retry connection'}</button>${renderError?'<button class="btn" id="go-overview">Go to Overview</button>':''}</div></div></main>`;
 document.getElementById('retry-startup').addEventListener('click',()=>location.reload());
 if(renderError)document.getElementById('go-overview').addEventListener('click',()=>{location.hash='#overview';location.reload();});
}
async function load(){
 let stage='connection';
 try {
  const r=await fetchWithTimeout('/api/bootstrap',{credentials:'same-origin',headers:{Accept:'application/json'}});
  if(r.redirected&&r.url.includes('login')){location.href='/login.html';return;}
  if(r.status===401 || r.status===403){location.href='/login.html';return;}
  if(!r.ok){
   const error=await r.json().catch(()=>({}));
   throw new Error(error.error||`Workspace request failed (HTTP ${r.status}). Check the Spring Boot console.`);
  }
  data=await r.json();
  if(!data?.me || typeof data.me!=='object')throw new Error('Unexpected workspace response: signed-in account was not included.');
  for(const key of ['projects','members','memberships','tasks','activities','comments']){
   if(!Array.isArray(data[key]))throw new Error(`Unexpected workspace response: ${key} was not included as a list.`);
  }
  await getCsrf();
  stage='render';
  if(!data.projects.some(p=>p.id===state.projectId))state.projectId=data.projects[0]?.id||null;
  const initial=decodeURIComponent(location.hash.slice(1)||'');
  if(initial.startsWith('project/')){const parts=initial.split('/');if(prj(parts[1])){state.projectId=parts[1];state.page=parts[2]||'board';}}
  else if(['overview','projects','my-tasks','team','reports','activity','search'].includes(initial))state.page=initial;
  document.addEventListener('click',onClick);
  document.addEventListener('change',onChange);
  document.addEventListener('submit',onSubmit);
  document.addEventListener('input',onInput);
  document.addEventListener('keydown',onKey);
  document.addEventListener('dragstart',onDragStart);
  document.addEventListener('dragend',onDragEnd);
  document.addEventListener('dragover',onDragOver);
  document.addEventListener('dragleave',onDragLeave);
  document.addEventListener('drop',onDrop);
  window.addEventListener('popstate',()=>setPage(location.hash.slice(1)||'overview',false));
  render();
 } catch(err){startupError(err,stage);}
}
async function api(method,path,body){
 const headers={'Content-Type':'application/json',Accept:'application/json'};
 if(method!=='GET'){if(!csrfToken)await getCsrf();headers['X-XSRF-TOKEN']=csrfToken;}
 let r=await fetchWithTimeout('/api'+path,{method,credentials:'same-origin',headers,body:body===undefined?undefined:JSON.stringify(body)},20000);
 if(r.status===401 || r.redirected&&r.url.includes('login')){location.href='/login.html';throw Error('Session expired. Please sign in again.');}
 if(!r.ok){let error=await r.json().catch(()=>({error:`Request failed (${r.status})`}));const failure=new Error(error.error||`Request failed (${r.status})`);failure.status=r.status;throw failure;}
 return r.status===204?null:r.json();
}
async function refresh(){data=await api('GET','/bootstrap');if(!data.projects.some(p=>p.id===state.projectId))state.projectId=data.projects[0]?.id||null;}
async function action(kind,payload={},id){
 if(kind==='newTask')await api('POST','/tasks',payload);
 else if(kind==='updateTask')await api('PATCH',`/tasks/${id}`,payload);
 else if(kind==='status')await api('PATCH',`/tasks/${id}/status`,payload);
 else if(kind==='deleteTask')await api('DELETE',`/tasks/${id}`);
 else if(kind==='newProject'){
  const created=await api('POST','/projects',payload);
  state.projectId=created.id;state.page='board';state.view='board';
 }
 else if(kind==='updateProject')await api('PATCH',`/projects/${id}`,payload);
 else if(kind==='deleteProject'){await api('DELETE',`/projects/${id}`);state.page='projects';state.projectId=null;}
 else if(kind==='projectMembers')await api('PUT',`/projects/${id}/members`,payload);
 else if(kind==='inviteProjectMember')await api('POST',`/projects/${id}/members/invite`,payload);
 else if(kind==='newMember')await api('POST','/members',payload);
 else if(kind==='updateMember')await api('PATCH',`/members/${id}`,payload);
 else if(kind==='comment')await api('POST',`/tasks/${id}/comments`,payload);
 else if(kind==='password')await api('POST','/account/password',payload);
 else throw new Error('Unsupported action');
 await refresh();
}
const toast=(message,error=false)=>{const n=document.createElement('div');n.className='toast'+(error?' error':'');n.innerHTML=`${I(error?'alert':'checkCircle')}<span>${E(message)}</span>`;document.getElementById('toasts').append(n);setTimeout(()=>n.remove(),3500);};
function setPage(page,history=true){
 if(typeof page!=='string'||!page.trim())page='overview';
 let s=page.split('/');if(s[0]==='project'&&prj(s[1])){state.projectId=s[1];state.page=s[2]||'board';}
 else state.page=page;
 state.search='';state.filterPriority='ALL';state.filterMember='ALL';state.mobileMenu=false;state.notice=false;
 if(history)window.history.pushState(null,'','#'+(page||'overview'));
 render();
}
function navItem(page,text,icon,count){return `<button class="side-item ${state.page===page?'active':''}" data-action="nav" data-page="${A(page)}"><span class="side-ico">${I(icon)}</span><span>${E(text)}</span>${count!==undefined?`<span class="side-count">${count}</span>`:''}</button>`;}
function sidebar(){
 const open=state.mobileMenu;
 return `<aside class="sidebar ${open?'open':''}" aria-label="Main navigation"><div class="sidebar-head"><div class="logo"><span class="mark">✳</span><span>tasky<span class="brand-dot">.</span></span></div><button class="icon-btn collapse-btn" data-action="close-menu" title="Close sidebar">${I('chevronLeft')}</button></div>
 <div class="workspace-box"><span class="workspace-symbol">W</span><span class="workspace-name"><strong>Workspace</strong><small>Team workspace</small></span></div>
 <div class="sidebar-scroll">
  <div class="side-section"><div class="section-caption">WORKSPACE</div>
  ${navItem('overview','Overview','grid')}${navItem('my-tasks','My tasks','checkCircle',myWorkTasks().filter(t=>t.status!=='DONE').length)}
  ${navItem('projects','All projects','layers')}${navItem('team','Team members','users')}${navItem('reports','Analytics & reports','chart')}${navItem('activity','Activity log','history')}</div>
  <div class="side-section"><div class="side-header"><span class="section-caption">YOUR PROJECTS</span>${canCreateProject()?`<button class="icon-btn" data-action="modal-project" title="Create project">${I('plus','i16')}</button>`:''}</div>
   ${data.projects.map(p=>`<button class="side-item project-item ${['board','project-overview','project-reports','settings'].includes(state.page)&&state.projectId===p.id?'active':''}" data-action="project" data-id="${A(p.id)}"><span class="project-dot dot-${A(p.color)}"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(p.name)}</span></button>`).join('')}
   ${canCreateProject()?`<button class="side-item" data-action="modal-project">${I('plus','i14')} <span>Create a project</span></button>`:''}</div>
 </div>
 <div class="sidebar-bottom"><div class="help-box"><div class="help-icon">${I('sparkles','i16')}</div><strong>A little more organized.</strong><p>Good work happens when everyone knows what's next.</p><button class="help-link" data-action="nav" data-page="overview">Explore workspace ${I('chevronRight','i14')}</button></div>
 <div class="user-mini" data-action="profile">${avatar(data.me,'avatar-md')}<div class="user-mini-name"><strong>${E(displayName(data.me))}</strong><small>${E(cap(data.me.role))}</small></div>${I('more','i16')}</div></div></aside>`;
}
function topbar(){
 let label=state.page==='board'?'Projects':{'overview':'Workspace','projects':'Projects','my-tasks':'My work','team':'People','reports':'Insights','activity':'Activity','settings':'Settings'}[state.page]||'Workspace';
 return `<header class="topbar"><div class="top-left"><button class="icon-btn mobile-toggle" data-action="mobile-menu" aria-label="Open menu">${I('menu','i20')}</button><span class="top-kicker">Workspace</span><span class="top-sep">/</span><span class="top-current">${E(state.page==='board'?prj(state.projectId)?.name||'Board':label)}</span></div>
 <div class="top-actions"><label class="top-search">${I('search','i16')}<input id="global-search" value="${A(state.globalSearch)}" placeholder="Search tasks..." aria-label="Search tasks"><span class="keycap">/</span></label>
 <button class="icon-btn" data-action="help" title="Keyboard shortcuts">${I('help','i20')}</button><div class="notify-wrap"><button class="icon-btn" data-action="notifications" title="Recent notifications" aria-label="Recent notifications">${I('bell','i20')}</button>
 ${state.notice?`<div class="pop-menu"><div class="pop-header">Recent activity</div>${sortActivity(data.activities).slice(0,4).map(a=>`<div class="pop-row">${avatar(who(a.actorId),'avatar-sm')}<div><strong>${E(who(a.actorId)?.name||'Team member')}</strong><div>${E(a.message)}</div><small>${ago(a.createdAt)}</small></div></div>`).join('')||'<p class="subtitle" style="padding:12px 5px">No recent activity</p>'}<button class="muted-link" data-action="nav" data-page="activity" style="padding:10px 6px">View all activity ${I('chevronRight','i14')}</button></div>`:''}</div>
 <button class="icon-btn top-avatar" data-action="profile" title="Open your profile" style="width:38px;height:38px">${avatar(data.me,'avatar-md')}</button></div></header>`;
}
function pageHeader(title,subtitle='',buttons='',breadcrumbs=[]){
 return `<div class="breadcrumb"><span>Workspace</span>${breadcrumbs.map(b=>`${I('chevronRight','i14')}<strong>${E(b)}</strong>`).join('')}</div><div class="page-head"><div><h1 class="page-title">${E(title)}</h1>${subtitle?`<p class="subtitle">${E(subtitle)}</p>`:''}</div><div class="page-actions">${buttons}</div></div>`;
}
function projectHeading(p){
 let mt=metrics(projectTasks(p.id)),peeps=membersFor(p.id);
 return `<div class="breadcrumb"><span>Projects</span>${I('chevronRight','i14')}<strong>${E(p.name)}</strong></div>
 <div class="page-head"><div><div style="display:flex;align-items:center;gap:12px"><h1 class="page-title">${E(p.name)}</h1><span class="tag-status status-${A(p.status)}">${E(cap(p.status))}</span></div><div class="project-meta"><span class="meta-desc">${E(p.key)} project</span><span class="mini-divider"></span><div class="avatar-stack">${peeps.slice(0,5).map(u=>avatar(u,'avatar-sm')).join('')}${peeps.length>5?`<span class="avatar avatar-more avatar-sm">+${peeps.length-5}</span>`:''}</div><span class="meta-desc">${peeps.length} members</span><span class="mini-divider"></span><span class="meta-desc">${mt.completion}% complete</span></div></div>
 <div class="page-actions"><button class="btn" data-action="modal-members">${I('users')} ${isManagerOf(p)?'Manage team':'View team'}</button><button class="btn primary" data-action="modal-task">${I('plus')} Create task</button></div></div>
 <nav class="tabs" aria-label="Project views"><button class="tab ${state.page==='board'&&state.view==='board'?'active':''}" data-action="board-view" data-view="board">Board</button><button class="tab ${state.page==='board'&&state.view==='list'?'active':''}" data-action="board-view" data-view="list">List</button><button class="tab ${state.page==='project-overview'?'active':''}" data-action="subpage" data-page="project-overview">Overview</button><button class="tab ${state.page==='project-reports'?'active':''}" data-action="subpage" data-page="project-reports">Reports</button><button class="tab ${state.page==='settings'?'active':''}" data-action="subpage" data-page="settings">Settings</button></nav>`;
}
function render(){
 if(!data?.me)return;
 let c='';switch(state.page){
 case 'board':c=boardPage();break;
 case 'overview':c=overviewPage();break;
 case 'projects':c=projectsPage();break;
 case 'my-tasks':c=myTasksPage();break;
 case 'team':c=teamPage();break;
 case 'member-tasks':c=memberTasksPage();break;
 case 'reports':c=reportsPage();break;
 case 'project-overview':c=projectOverviewPage();break;
 case 'project-reports':c=projectReportsPage();break;
 case 'settings':c=settingsPage();break;
 case 'activity':c=activityPage();break;
 default:c=overviewPage();
 }
 const app=document.getElementById('app');
 app.innerHTML=`<div class="app-shell">${sidebar()}<div class="main-area">${topbar()}<main class="content" id="main-content">${c}</main></div>${state.mobileMenu?`<button class="sidebar-shade" aria-label="Close navigation" data-action="close-menu"></button>`:''}</div>`;
 document.getElementById('overlays').innerHTML=state.modal?modalHtml(state.modal):'';
 document.title=`${({'board':prj(state.projectId)?.name,'overview':'Overview','projects':'Projects','team':'Team','reports':'Reports','my-tasks':'My tasks','activity':'Activity','settings':'Project settings'}[state.page]||'Tasky')} · Tasky`;
}
function boardPage(){
 const p=prj(state.projectId);if(!p)return projectsPage();
 const qualified=projectTasks(p.id).filter(t=>(state.filterPriority==='ALL'||t.priority===state.filterPriority)&&(state.filterMember==='ALL'||t.assigneeId===state.filterMember||state.filterMember==='UNASSIGNED'&&!t.assigneeId)&&(!state.search||`${t.title} ${t.key} ${t.description}`.toLowerCase().includes(state.search.toLowerCase())));
 const memberOpts=membersFor(p.id);
 return `${projectHeading(p)}
 <div class="board-header"><div class="board-left"><label class="filter-search">${I('search','i16')}<input id="task-search" value="${A(state.search)}" placeholder="Search tasks..." aria-label="Search project tasks"></label>
 <select class="simple-select" id="priority-filter" aria-label="Filter by priority"><option value="ALL">All priorities</option>${PRIORITIES.map(x=>`<option value="${x}" ${state.filterPriority===x?'selected':''}>${cap(x)} priority</option>`).join('')}</select>
 <select class="simple-select" id="member-filter" aria-label="Filter by assignee"><option value="ALL">All assignees</option><option value="UNASSIGNED" ${state.filterMember==='UNASSIGNED'?'selected':''}>Unassigned</option>${memberOpts.map(u=>`<option value="${A(u.id)}" ${state.filterMember===u.id?'selected':''}>${E(displayName(u))}</option>`).join('')}</select></div>
 <div class="board-right"><span class="results-caption">${qualified.length} of ${projectTasks(p.id).length} tasks</span><div class="view-switch"><button class="${state.view==='board'?'selected':''}" data-action="board-view" data-view="board" aria-label="Kanban view" title="Kanban view">${I('board')}</button><button class="${state.view==='list'?'selected':''}" data-action="board-view" data-view="list" aria-label="List view" title="List view">${I('list')}</button></div></div></div>
 ${state.view==='board'?`<section class="kanban-board">${STATUS.map(([status,label])=>column(status,label,qualified.filter(t=>t.status===status))).join('')}</section>`:taskTable(qualified,{showProject:false})}`;
}
function column(status,label,ts){return `<div class="board-column" data-status="${A(status)}"><div class="column-head"><span class="column-dot ${status!=='TODO'?'col-'+status:''}"></span><span class="column-title">${E(label)}</span><span class="column-count">${ts.length}</span><button class="col-add" data-action="modal-task" data-status="${A(status)}" title="Create task">${I('plus','i16')}</button></div><div class="board-items" data-status="${A(status)}">${ts.length?ts.map(taskCard).join(''):`<div class="empty-col">${I('layers')} No tasks here yet</div>`}</div><button class="add-card" data-action="modal-task" data-status="${A(status)}">${I('plus','i14')} Add a task</button></div>`;}
function taskCard(t){
 const com=data.comments.filter(x=>x.taskId===t.id).length;
 return `<article class="task-card" draggable="true" data-task="${A(t.id)}" data-action="open-task" data-id="${A(t.id)}" tabindex="0" role="button" aria-label="Open ${A(t.title)}">
 <div class="card-top"><span class="issue-key">${E(t.key)}</span><button class="card-menu" data-action="open-task" data-id="${A(t.id)}" title="View task details">${I('more','i16')}</button></div>
 <div class="card-title">${E(t.title)}</div><span class="card-category cat-${A(t.category)}">${E(t.category||'Task')}</span>
 <div class="card-bottom"><div class="card-meta"><span class="priority priority-${A(t.priority)}">${I(t.priority==='LOW'?'chevronDown':t.priority==='URGENT'?'arrows':'arrowUp','i14')}${cap(t.priority)}</span>${t.dueDate?`<span class="due-date ${overdue(t)?'overdue':''}">${I('calendar','i14')}${dt(t.dueDate)}</span>`:''}</div><div class="card-foot-right">${com?`<span class="comment-indicator">${I('message','i14')}${com}</span>`:''}${avatar(who(t.assigneeId),'avatar-sm')}</div></div></article>`;
}
function taskTable(tasks,{showProject=true,showOwnership=false}={}){
 if(!tasks.length)return empty('No matching tasks','Try a different filter or create a new task.','layers');
 return `<div class="table-wrap"><table class="data-table"><thead><tr><th>TASK</th>${showProject?'<th>PROJECT</th>':''}${showOwnership?'<th>MY ROLE</th>':''}<th>STATUS</th><th>PRIORITY</th><th>ASSIGNEE</th><th>DUE DATE</th></tr></thead><tbody>${tasks.map(t=>`<tr class="clickable" data-action="open-task" data-id="${A(t.id)}"><td><div class="task-title-line"><span class="mini-task-icon">${I('checkCircle','i14')}</span><div class="cell-main">${E(t.title)}<span class="cell-key">${E(t.key)}</span></div></div></td>${showProject?`<td>${E(prj(t.projectId)?.name||'')}</td>`:''}${showOwnership?`<td><span class="my-work-label">${t.assigneeId===data.me.id?'Assigned to me':'Created by me'}</span></td>`:''}<td><span class="tag-status status-${A(t.status)}">${E(STATUS_NAMES[t.status])}</span></td><td><span class="priority priority-${A(t.priority)}">${I(t.priority==='URGENT'?'arrows':'arrowUp','i14')}${E(cap(t.priority))}</span></td><td><div class="member-person">${avatar(who(t.assigneeId),'avatar-sm')}<span>${E(who(t.assigneeId)?.name||'Unassigned')}</span></div></td><td class="${overdue(t)?'overdue-label':''}">${t.dueDate?dt(t.dueDate):'—'}</td></tr>`).join('')}</tbody></table></div><div class="pagination-note">Showing ${tasks.length} task${tasks.length===1?'':'s'}</div>`;
}
const empty=(title,subtitle,icon)=>`<div class="empty-state"><div class="empty-icon">${I(icon,'i24')}</div><h3>${E(title)}</h3><p>${E(subtitle)}</p></div>`;
function statCard(label,value,foot,icon,cls=''){
 return `<div class="stat-card"><div class="stat-card-top"><span class="stat-eyebrow">${E(label)}</span><span class="stat-icon ${cls}">${I(icon)}</span></div><div class="stat-value">${E(value)}</div><div class="stat-foot">${E(foot)}</div></div>`;
}
function projectProgress(p){const m=metrics(projectTasks(p.id));return `<div><div class="progress-row-top"><span class="progress-name"><span class="project-dot dot-${A(p.color)}"></span>${E(p.name)}</span><span class="progress-pct">${m.completion}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${m.completion}%"></div></div><div class="progress-info"><span>${m.done} of ${m.count} tasks completed</span><span>${E(p.key)}</span></div></div>`;}
function donut(ts){
 let m=metrics(ts),vals=[m.todo,m.inProgress,m.review,m.done],stops=[],angle=0;
 STATUS.forEach(([key],i)=>{let pc=m.count?vals[i]/m.count*100:0;stops.push(`${COLORS[key]} ${angle}% ${angle+pc}%`);angle+=pc;});
 return `<div class="donut-wrap"><div class="donut" style="background:conic-gradient(${m.count?stops.join(','):'#e9ebf0 0% 100%'})"><div class="donut-center"><strong>${m.count}</strong><span>total tasks</span></div></div><div class="legend">${STATUS.map(([key,label],i)=>`<div class="legend-row"><span class="legend-label"><span class="legend-dot" style="background:${COLORS[key]}"></span>${E(cap(label))}</span><strong>${vals[i]}</strong></div>`).join('')}</div></div>`;
}
function activityEntry(a){const u=who(a.actorId);return `<div class="activity-entry"><span class="activity-symbol">${I(a.type==='STATUS_CHANGED'?'arrows':a.type==='COMMENTED'?'message':a.type==='TASK_CREATED'?'plus':'history','i16')}</span><div class="activity-body"><p><strong>${E(u?.name||'Team member')}</strong> ${E(a.message)}</p><small>${E(prj(a.projectId)?.name||'Workspace')}</small></div><span class="activity-date">${ago(a.createdAt)}</span></div>`;}
function workloadPanel(ts){
 let ppl=data.members.map(u=>({...u,assigned:ts.filter(t=>t.assigneeId===u.id&&t.status!=='DONE').length})).sort((a,b)=>b.assigned-a.assigned).slice(0,6);
 let max=Math.max(1,...ppl.map(p=>p.assigned));
 return `<div class="workload-list">${ppl.map(u=>`<div class="workload-row"><div class="workload-row-name">${avatar(u,'avatar-sm')}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(firstName(u))}</span></div><div class="progress-track"><div class="progress-fill ${u.assigned===max&&max>3?'orange':''}" style="width:${u.assigned/max*100}%"></div></div><span class="workload-count">${u.assigned}</span></div>`).join('')}</div>`;
}
function overviewPage(){
 const tasks=allTasks(),m=metrics(tasks);
 if(!data.projects.length) return `${pageHeader('Welcome to Tasky','Your workspace is ready. Create your first project and start organizing tasks immediately.', '', ['Overview'])}<section class="welcome-hero"><div class="welcome-art">${I('layers','i24')}</div><div class="welcome-eyebrow">YOUR WORKSPACE STARTS HERE</div><h2>Bring your team’s work together.</h2><p>Set up a project, invite your team, and organize tasks on a clear Kanban board. Your real work starts with a blank canvas.</p><button class="btn primary" data-action="modal-project">${I('plus')} Create your first project</button></section>`;
 return `${pageHeader('Hello, '+firstName(data.me)+' 👋','Here’s what’s happening across your workspace today.',`<button class="btn" data-action="nav" data-page="reports">${I('chart')} View reports</button><button class="btn primary" data-action="modal-task">${I('plus')} New task</button>`,['Overview'])}
 <div class="insight-banner"><div><h2>Make today a productive one ✨</h2><p>Keep projects moving with one clear view of your team's priorities.</p></div><button class="btn" data-action="nav" data-page="my-tasks">View my tasks ${I('chevronRight')}</button></div>
 <div class="stat-grid">${statCard('Active projects',data.projects.filter(p=>p.status==='ACTIVE').length,`${data.projects.length} total projects`,'layers')}${statCard('Total tasks',m.count,`${m.inProgress} currently in progress`,'checkCircle')}${statCard('Completed tasks',m.done,`${m.completion}% completion rate`,'target','green')}${statCard('Overdue tasks',m.overdue,'Tasks needing attention','alert','rose')}</div>
 <div class="panel-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Project progress</h2><p class="panel-sub">A quick look at how your projects are moving</p></div><button class="muted-link" data-action="nav" data-page="projects">All projects ${I('chevronRight','i14')}</button></div><div class="project-progress-list">${data.projects.map(projectProgress).join('')}</div></section>
 <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Task overview</h2><p class="panel-sub">Tasks across every workflow stage</p></div><button class="icon-btn" data-action="nav" data-page="reports" title="Open reports">${I('external','i16')}</button></div>${donut(tasks)}</section></div>
 <div class="panel-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Recent activity</h2><p class="panel-sub">Stay in sync with the latest team updates</p></div><button class="muted-link" data-action="nav" data-page="activity">View all ${I('chevronRight','i14')}</button></div><div class="activity-list">${sortActivity(data.activities).slice(0,5).map(activityEntry).join('')||empty('No activity yet','Updates will appear here.','history')}</div></section>
 <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Team workload</h2><p class="panel-sub">Open tasks assigned to each team member</p></div><button class="muted-link" data-action="nav" data-page="team">View team ${I('chevronRight','i14')}</button></div>${workloadPanel(tasks)}</section></div>`;
}
function projectsPage(){
 return `${pageHeader('Projects','A home for every important initiative and the people behind it.',canCreateProject()?`<button class="btn primary" data-action="modal-project">${I('plus')} New project</button>`:'',['All projects'])}
 <div class="stat-grid">${statCard('All projects',data.projects.length,'Workspace-wide project portfolio','layers')}${statCard('Active',data.projects.filter(p=>p.status==='ACTIVE').length,'Currently being worked on','pulse','green')}${statCard('In planning',data.projects.filter(p=>p.status==='PLANNING').length,'Work still taking shape','calendar','orange')}${statCard('Completed',data.projects.filter(p=>p.status==='COMPLETED').length,'Ready to celebrate','checkCircle','green')}</div>
 <div class="panel-header"><h2 class="panel-title">Your projects <span style="color:#abb1be;font-size:11px;margin-left:5px">${data.projects.length}</span></h2></div>
 ${!data.projects.length?empty('No projects yet','Create your own project to start working, or ask another project lead to invite you.','layers'):''}<section class="overview-projects">${data.projects.map(p=>{let m=metrics(projectTasks(p.id));return `<article class="project-tile" data-action="project" data-id="${A(p.id)}" tabindex="0" role="button"><div class="project-tile-top"><span class="project-tile-icon ${A(p.color)}">${E(p.key.slice(0,1))}</span><div style="flex:1"><h3 class="project-tile-name">${E(p.name)}</h3><div class="project-tile-key">${E(p.key)} · ${E(cap(p.status))}</div></div>${I('chevronRight','i16')}</div><p class="project-description">${E(p.description)}</p><div class="project-tile-bottom"><span class="tile-stat"><strong>${m.done}/${m.count}</strong> tasks completed</span><div class="avatar-stack">${membersFor(p.id).slice(0,3).map(u=>avatar(u,'avatar-sm')).join('')}</div></div><div class="progress-track" style="margin-top:13px;height:5px"><div class="progress-fill" style="width:${m.completion}%"></div></div></article>`;}).join('')}</section>`;
}
function myTasksPage(){
 const my=myWorkTasks(),m=metrics(my),mine=data.me.id;
 const assigned=my.filter(t=>t.assigneeId===mine),created=my.filter(t=>t.creatorId===mine);
 const display=my.filter(t=>{
  if(state.myFilter==='ALL')return true;
  if(state.myFilter==='ASSIGNED')return t.assigneeId===mine;
  if(state.myFilter==='CREATED')return t.creatorId===mine;
  if(state.myFilter==='UNASSIGNED_CREATED')return t.creatorId===mine&&!t.assigneeId;
  if(state.myFilter==='OPEN')return t.status!=='DONE';
  return t.status===state.myFilter;
 }).sort((a,b)=>Number(overdue(b))-Number(overdue(a)));
 return `${pageHeader('My tasks','Work assigned to you, plus tasks you created and are tracking.',`<button class="btn primary" data-action="${data.projects.length?'modal-task':'modal-project'}">${I('plus')} ${data.projects.length?'Create task':'Create project'}</button>`,['My tasks'])}
 <div class="stat-grid">${statCard('Assigned to me',assigned.length,'Tasks where you are the assignee','checkCircle')}${statCard('Created by me',created.length,'Including unassigned work','layers')}${statCard('Open work',my.filter(t=>t.status!=='DONE').length,'Created or assigned to you','pulse')}${statCard('Overdue',m.overdue,'Needs your attention','alert','rose')}</div>
 <div class="panel-header"><h2 class="panel-title">Your work</h2><select class="simple-select" id="my-filter" aria-label="Filter my tasks">
 ${[['ALL','All my work'],['ASSIGNED','Assigned to me'],['CREATED','Created by me'],['UNASSIGNED_CREATED','Unassigned (created by me)'],['OPEN','Open tasks']].map(([v,label])=>`<option value="${v}" ${state.myFilter===v?'selected':''}>${label}</option>`).join('')}
 ${STATUS.map(([x,label])=>`<option value="${x}" ${state.myFilter===x?'selected':''}>${cap(label)}</option>`).join('')}</select></div>
 ${display.length?taskTable(display,{showOwnership:true}):empty('No work in this view',state.myFilter==='ALL'?'Tasks assigned to you or created by you will appear here.':'No tasks match the selected filter.','layers')}`;
}
function teamPage(){
 const ts=allTasks();return `${pageHeader('Team members','Every great project starts with the right people.',canManage()?`<button class="btn primary" data-action="modal-member">${I('plus')} Add member</button>`:'',['Team'])}
 <div class="stat-grid">${statCard('Team members',data.members.length,'People across the workspace','users')}${statCard('Project leads',data.members.filter(u=>u.role!=='MEMBER').length,'Admins and managers','user')}${statCard('Active assignments',ts.filter(t=>t.status!=='DONE'&&t.assigneeId).length,'Tasks currently assigned','layers')}${statCard('Available capacity',data.members.filter(u=>ts.filter(t=>t.assigneeId===u.id&&t.status!=='DONE').length<=2).length,'Members with ≤ 2 open tasks','target','green')}</div>
 <div class="panel-header"><h2 class="panel-title">People in your workspace</h2><span class="results-caption">${data.members.length} members</span></div>
 <section class="member-grid">${data.members.map(u=>{const assigned=ts.filter(t=>t.assigneeId===u.id),m=metrics(assigned),projectCount=data.memberships.filter(x=>x.memberId===u.id).length;return `<article class="member-card clickable" data-action="member-tasks" data-id="${A(u.id)}" tabindex="0" role="button"><div class="member-card-head">${avatar(u,'avatar-lg')}<div style="flex:1;min-width:0"><h3>${E(displayName(u))}</h3><p>${E(u.title||'Team member')}</p></div>${(data.me.role==='ADMIN'||(!['ADMIN','MANAGER'].includes(u.role)&&canManage()))?`<button class="icon-btn" data-action="edit-member" data-id="${A(u.id)}" title="Edit team member">${I('edit','i16')}</button>`:''}</div><span class="badge ${A(u.role)}">${E(cap(u.role))}</span>${!u.enabled?'<span class="tag-status">Disabled</span>':''}<div class="member-card-foot"><span><strong>${m.count-m.done}</strong> open tasks</span><span><strong>${m.done}</strong> done</span><span><strong>${projectCount}</strong> projects</span></div></article>`;}).join('')}</section>`;
}
function workloadChart(ts){
 const people=data.members.map(u=>({name:firstName(u),open:ts.filter(t=>t.assigneeId===u.id&&t.status!=='DONE').length,done:ts.filter(t=>t.assigneeId===u.id&&t.status==='DONE').length})).sort((a,b)=>b.open+b.done-a.open-a.done).slice(0,7);
 const max=Math.max(1,...people.map(p=>p.open+p.done));
 return `<div class="bars">${people.map(x=>`<div class="bar-group" title="${A(x.name)}: ${x.open} open, ${x.done} done"><div class="bar" style="height:${x.open/max*100}%"></div><div class="bar second" style="height:${x.done/max*100}%"></div></div>`).join('')}</div><div class="bar-labels">${people.map(p=>`<span>${E(p.name)}</span>`).join('')}</div><div class="bar-legend"><span><i class="legend-dot" style="background:#cecaff"></i>Open tasks</span><span><i class="legend-dot" style="background:#6358e9"></i>Completed</span></div>`;
}
function reportsContent(ts,projectSpecific=false){
 const m=metrics(ts),groups=projectSpecific?[prj(state.projectId)]:data.projects;
 return `<div class="stat-grid">${statCard('Completion rate',m.completion+'%','Share of finished tasks','target','green')}${statCard('Total tasks',m.count,'All tracked tasks','layers')}${statCard('In progress',m.inProgress,'Actively being worked on','pulse')}${statCard('Overdue tasks',m.overdue,'Past their target date','alert','rose')}</div>
 <div class="report-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Team productivity</h2><p class="panel-sub">Open and completed tasks by member</p></div></div>${workloadChart(ts)}</section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Workflow breakdown</h2><p class="panel-sub">Where your tasks currently stand</p></div></div>${donut(ts)}</section></div>
 <div class="panel-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Project health</h2><p class="panel-sub">Completion against planned work</p></div></div><div class="project-progress-list">${groups.filter(Boolean).map(projectProgress).join('')}</div></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Priority breakdown</h2><p class="panel-sub">What your team should focus on</p></div></div><div class="project-progress-list">${PRIORITIES.toReversed().map(p=>{let n=ts.filter(t=>t.priority===p).length;return `<div><div class="progress-row-top"><span class="priority priority-${p}">${I(p==='URGENT'?'arrows':'arrowUp','i14')}${cap(p)}</span><span class="progress-pct">${n} tasks</span></div><div class="progress-track"><div class="progress-fill ${p==='URGENT'?'rose':p==='HIGH'?'orange':p==='LOW'?'green':''}" style="width:${m.count?n/m.count*100:0}%"></div></div></div>`;}).join('')}</div></section></div>`;
}
function reportsPage(){return `${pageHeader('Analytics & reports','Clear insights to help your team make better decisions.',`<button class="btn" data-action="export-csv">${I('download')} Export CSV</button>`,['Reports'])}${reportsContent(allTasks())}`;}
function projectReportsPage(){const p=prj(state.projectId);return `${projectHeading(p)}<div class="panel-header"><div><h2 class="panel-title">Project analytics</h2><p class="panel-sub">${E(p.name)} task health and team performance</p></div><button class="btn" data-action="export-csv" data-project="${A(p.id)}">${I('download')} Export CSV</button></div>${reportsContent(projectTasks(p.id),true)}`;}
function activityPage(){let acts=sortActivity(data.activities);return `${pageHeader('Activity log','A clear record of how work has progressed across your teams.',`<button class="btn" data-action="export-activity">${I('download')} Export activity</button>`,['Activity'])}<section class="panel" style="max-width:900px"><div class="panel-header"><h2 class="panel-title">Timeline</h2><span class="results-caption">${acts.length} recent events</span></div><div class="activity-list">${acts.slice(0,100).map(activityEntry).join('')||empty('No activity to display','Your team updates will appear here.','history')}</div></section>`;}
function projectOverviewPage(){const p=prj(state.projectId),ts=projectTasks(p.id),m=metrics(ts);
 return `${projectHeading(p)}<div class="stat-grid">${statCard('Total tasks',m.count,'Across the project board','layers')}${statCard('Completed',m.done,`${m.completion}% of all tasks`,'checkCircle','green')}${statCard('In progress',m.inProgress,'Currently being worked on','pulse')}${statCard('Overdue',m.overdue,'Past the due date','alert','rose')}</div><div class="panel-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">About this project</h2><p class="panel-sub">Overview, objectives and important dates</p></div></div><p class="task-detail-description">${E(p.description||'No description added yet.')}</p><div class="info-list"><div class="info-row"><span>Project lead</span><span>${E(who(p.leadId)?.name||'Unassigned')}</span></div><div class="info-row"><span>Start date</span><span>${dt(p.startDate)}</span></div><div class="info-row"><span>Target completion</span><span>${dt(p.targetDate)}</span></div><div class="info-row"><span>Project status</span><span class="tag-status status-${A(p.status)}">${E(cap(p.status))}</span></div><div class="info-row"><span>Project ID</span><span>${E(p.key)}</span></div></div></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Task distribution</h2><p class="panel-sub">Progress by workflow stage</p></div></div>${donut(ts)}<div class="panel-footer"><div class="progress-row-top"><strong class="panel-sub" style="color:#657089">Overall completion</strong><strong class="progress-pct">${m.completion}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${m.completion}%"></div></div></div></section></div><div class="panel-grid"><section class="panel"><div class="panel-header"><h2 class="panel-title">Project team</h2><button class="muted-link" data-action="modal-members">Manage team ${I('chevronRight','i14')}</button></div><div class="member-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${membersFor(p.id).map(u=>`<div class="member-person" style="margin:4px 0 12px">${avatar(u,'avatar-md')}<div><strong>${E(displayName(u))}</strong><small>${E(u.title)}</small></div></div>`).join('')}</div></section><section class="panel"><div class="panel-header"><h2 class="panel-title">Recent updates</h2><button class="muted-link" data-action="subpage" data-page="project-reports">View reports ${I('chevronRight','i14')}</button></div><div class="activity-list">${sortActivity(data.activities.filter(a=>a.projectId===p.id)).slice(0,5).map(activityEntry).join('')||empty('No updates','Status changes will appear here.','history')}</div></section></div>`;
}
function settingsPage(){
 const p=prj(state.projectId);return `${projectHeading(p)}<div class="panel" style="max-width:810px"><div class="panel-header"><div><h2 class="panel-title">Project settings</h2><p class="panel-sub">Keep the most important details of your project up to date.</p></div></div>
 ${isManagerOf(p)?`<form id="project-settings-form"><div class="field-grid"><div class="field"><label for="edit-project-name">Project name</label><input name="name" id="edit-project-name" value="${A(p.name)}" required maxlength="100"></div><div class="field"><label>Project key</label><input value="${A(p.key)}" disabled></div></div><div class="field"><label>Project description</label><textarea name="description" rows="4" maxlength="2500">${E(p.description)}</textarea></div><div class="field"><label>Project lead</label><select name="leadId">${data.members.filter(u=>u.enabled).map(u=>`<option value="${A(u.id)}" ${p.leadId===u.id?'selected':''}>${E(displayName(u))}</option>`).join('')}</select><small>The lead is automatically added to the project team and can manage project settings.</small></div><div class="field-grid"><div class="field"><label>Start date</label><input type="date" name="startDate" value="${A(p.startDate||'')}"></div><div class="field"><label>Target completion date</label><input type="date" name="targetDate" value="${A(p.targetDate||'')}"></div><div class="field"><label>Project status</label><select name="status">${['PLANNING','ACTIVE','ON_HOLD','COMPLETED'].map(x=>`<option value="${x}" ${p.status===x?'selected':''}>${cap(x)}</option>`).join('')}</select></div><div class="field"><label>Project accent</label><select name="color">${['indigo','violet','teal','orange','rose','sky','green'].map(x=>`<option value="${x}" ${p.color===x?'selected':''}>${cap(x)}</option>`).join('')}</select></div></div><div class="settings-actions"><button class="btn danger" type="button" data-action="delete-project" data-id="${A(p.id)}">${I('trash')} Delete project</button><button class="btn primary" type="submit">${I('check')} Save changes</button></div></form>`:'<p class="subtitle">Only project leads and managers can update project settings.</p>'}</div>`;
}
function modalHtml(m){
 if(m.type==='task')return taskModal(m);
 if(m.type==='newTask')return newTaskModal(m);
 if(m.type==='project')return newProjectModal();
 if(m.type==='member')return newMemberModal();
 if(m.type==='password')return passwordModal();
 if(m.type==='editMember')return editMemberModal(m.id);
 if(m.type==='members')return membersModal();
 if(m.type==='help')return modalFrame('Keyboard shortcuts','Move faster with Tasky.',`<div class="info-list">${[['/','Focus search'],['N','Create a new task'],['Esc','Close dialog'],['Drag & drop','Move tasks between Kanban columns']].map(([a,b])=>`<div class="info-row"><span><kbd class="keycap" style="padding:4px">${E(a)}</kbd></span><span>${E(b)}</span></div>`).join('')}</div>`,'');
 if(m.type==='profile')return modalFrame('Your account',data.me.email,`<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">${avatar(data.me,'avatar-lg')}<div><h3 style="font-size:15px">${E(displayName(data.me))}</h3><p class="subtitle" style="margin:2px 0">${E(data.me.title||'Team member')}</p></div></div><div class="info-list"><div class="info-row"><span>Workspace role</span><span>${E(cap(data.me.role))}</span></div><div class="info-row"><span>Email</span><span>${E(data.me.email)}</span></div></div>`,`<button class="btn" data-action="change-password">${I('user')} Change password</button><button class="btn" data-action="logout">${I('logout')} Sign out</button>`);
 return '';
}
function passwordModal(){
 return modalFrame('Change password','ACCOUNT SECURITY',`<form id="password-form"><div class="field"><label>Current password</label><input name="currentPassword" type="password" autocomplete="current-password" required></div><div class="field"><label>New password</label><input name="newPassword" type="password" minlength="12" maxlength="120" autocomplete="new-password" required><small>Use a unique password with at least 12 characters.</small></div><div class="field"><label>Confirm new password</label><input name="confirmPassword" type="password" minlength="12" maxlength="120" autocomplete="new-password" required></div><div class="modal-actions"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">Save new password</button></div></form>`,'','medium');
}
function modalFrame(title,subtitle,body,footer='',size=''){
 return `<div class="overlay" data-action="backdrop"><section class="modal ${size}" role="dialog" aria-modal="true" aria-label="${A(title)}"><div class="modal-head"><div><small>${E(subtitle)}</small><h2>${E(title)}</h2></div><button class="icon-btn" data-action="close-modal" aria-label="Close">${I('close')}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section></div>`;
}
function optionMembers(pid,selected=''){
 return `<option value="">Unassigned</option>${membersFor(pid).map(u=>`<option value="${A(u.id)}" ${selected===u.id?'selected':''}>${E(displayName(u))}</option>`).join('')}`;
}
function optionProjects(selected=''){
 return data.projects.map(p=>`<option value="${A(p.id)}" ${selected===p.id?'selected':''}>${E(p.name)}</option>`).join('');
}
function newTaskModal(m){
 let pid=m.projectId||state.projectId||data.projects[0]?.id,status=m.status||'TODO';
 const body=`<form id="new-task-form"><div class="field"><label>Task title <span class="required-star">*</span></label><input name="title" required maxlength="220" autocomplete="off" placeholder="e.g. Design the customer onboarding flow" autofocus></div>
 <div class="field"><label>Description</label><textarea name="description" rows="3" maxlength="6000" placeholder="Add a clear description and acceptance criteria..."></textarea></div>
 <div class="field-grid"><div class="field"><label>Project <span class="required-star">*</span></label><select name="projectId" id="task-project" required>${optionProjects(pid)}</select></div><div class="field"><label>Assignee</label><select name="assigneeId" id="task-assignee">${optionMembers(pid,m.assigneeId||(state.page==='my-tasks'&&memberIds(pid).has(data.me.id)?data.me.id:''))}</select></div><div class="field"><label>Status</label><select name="status">${STATUS.map(([x,label])=>`<option value="${x}" ${x===status?'selected':''}>${cap(label)}</option>`).join('')}</select></div><div class="field"><label>Priority</label><select name="priority">${PRIORITIES.map(x=>`<option value="${x}" ${x==='MEDIUM'?'selected':''}>${cap(x)}</option>`).join('')}</select></div><div class="field"><label>Category</label><select name="category">${['Feature','Development','Design','Research','Bug','Documentation'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label>Due date</label><input name="dueDate" type="date"></div></div>
 <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">${I('plus')} Create task</button></div></form>`;
 return modalFrame('Create a task','NEW TASK',body,'','medium');
}
function taskModal(m){
 let t=taskById(m.id);if(!t)return '';
 const activity=sortActivity(data.activities.filter(a=>a.taskId===t.id));
 const comments=data.comments.filter(c=>c.taskId===t.id).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
 const body=`<form id="edit-task-form" data-id="${A(t.id)}"><input type="hidden" name="version" value="${A(t.version)}"><div class="task-modal-cols"><div>
  <div class="field"><label>Task title <span class="required-star">*</span></label><input name="title" value="${A(t.title)}" required maxlength="220"></div>
  <div class="field"><label>Description</label><textarea name="description" rows="5" maxlength="6000">${E(t.description||'')}</textarea></div>
  <div class="task-mini-tabs"><button type="button" class="${state.detailTab==='comments'?'active':''}" data-action="detail-tab" data-tab="comments">Comments (${comments.length})</button><button type="button" class="${state.detailTab==='activity'?'active':''}" data-action="detail-tab" data-tab="activity">Activity (${activity.length})</button></div>
  ${state.detailTab==='comments'?`<div style="max-height:210px;overflow:auto">${comments.length?comments.map(c=>`<div class="comment-row">${avatar(who(c.authorId),'avatar-sm')}<div class="comment-content"><strong>${E(who(c.authorId)?.name||'Team member')}</strong><small>${ago(c.createdAt)}</small><p>${E(c.body)}</p></div></div>`).join(''):'<p class="subtitle" style="margin:0 0 12px">No comments yet. Start a conversation below.</p>'}</div>`:`<div class="activity-list" style="max-height:205px;overflow:auto">${activity.map(activityEntry).join('')||'<span class="subtitle">No activity yet.</span>'}</div>`}
  <div class="comment-form"><input id="comment-draft" placeholder="Write a comment..." maxlength="3000"><button type="button" class="btn small" data-action="post-comment" data-id="${A(t.id)}">${I('message','i14')} Post</button></div>
 </div><div class="task-side"><div class="field"><label>Status</label><select name="status">${STATUS.map(([key,label])=>`<option value="${key}" ${t.status===key?'selected':''}>${cap(label)}</option>`).join('')}</select></div>
 <div class="field"><label>Assignee</label><select name="assigneeId">${optionMembers(t.projectId,t.assigneeId)}</select></div>
 <div class="field"><label>Priority</label><select name="priority">${PRIORITIES.map(x=>`<option value="${x}" ${t.priority===x?'selected':''}>${cap(x)}</option>`).join('')}</select></div>
 <div class="field"><label>Category</label><select name="category">${['Feature','Development','Design','Research','Bug','Documentation'].map(x=>`<option ${t.category===x?'selected':''}>${x}</option>`).join('')}</select></div>
 <div class="field"><label>Due date</label><input type="date" name="dueDate" value="${A(t.dueDate||'')}"></div>
 <div class="field"><label>Project</label><input disabled value="${A(prj(t.projectId)?.name||'')}"></div></div></div>
 <div style="display:flex;align-items:center;justify-content:space-between;margin-top:22px;gap:10px;flex-wrap:wrap"><span>${isManagerOf(prj(t.projectId))?`<button class="btn danger small" type="button" data-action="delete-task" data-id="${A(t.id)}">${I('trash','i14')} Delete task</button>`:''}</span><span style="display:flex;gap:8px"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">${I('check')} Save changes</button></span></div>
 </form>`;
 return modalFrame(t.title,`${t.key}  ·  ${prj(t.projectId)?.name||'Project'}`,body,'','large');
}
function newProjectModal(){
 const body=`<form id="new-project-form"><div class="field-grid"><div class="field"><label>Project name <span class="required-star">*</span></label><input required maxlength="100" name="name" id="new-project-name" placeholder="Your project name"></div><div class="field"><label>Project key <span class="required-star">*</span></label><input required maxlength="10" minlength="2" pattern="[A-Za-z][A-Za-z0-9]{1,9}" name="key" id="new-project-key" placeholder="PROJ"><small>2–10 letters or numbers, starting with a letter</small></div></div>
 <div class="field"><label>Description</label><textarea name="description" rows="3" maxlength="2500" placeholder="What is this project about?"></textarea></div><div class="field-grid"><div class="field"><label>Start date</label><input type="date" name="startDate" value="${dateToday()}"></div><div class="field"><label>Target completion</label><input type="date" name="targetDate"></div><div class="field"><label>Status</label><select name="status"><option value="PLANNING">Planning</option><option value="ACTIVE" selected>Active</option><option value="ON_HOLD">On hold</option><option value="COMPLETED">Completed</option></select></div><div class="field"><label>Accent color</label><select name="color">${['indigo','violet','teal','orange','rose','sky','green'].map(x=>`<option value="${x}">${cap(x)}</option>`).join('')}</select></div></div><div style="display:flex;justify-content:flex-end;gap:8px"><button type="button" class="btn" data-action="close-modal">Cancel</button><button type="submit" class="btn primary">${I('plus')} Create project</button></div></form>`;
 return modalFrame('Create a project','NEW PROJECT',body,'','medium');
}
function editMemberModal(id){
 const u=who(id);if(!u)return '';
 const body=`<form id="edit-member-form" data-id="${A(id)}"><div class="field-grid"><div class="field"><label>Full name</label><input required maxlength="90" name="name" value="${A(u.name)}"></div><div class="field"><label>Job title</label><input maxlength="80" name="title" value="${A(u.title||'')}"></div></div><div class="field"><label>Email address</label><input value="${A(u.email)}" disabled></div>${data.me.role==='ADMIN'?`<div class="field"><label>Workspace role</label><select name="role">${['MEMBER','MANAGER','ADMIN'].map(r=>`<option value="${r}" ${u.role===r?'selected':''}>${cap(r)}</option>`).join('')}</select></div>`:''}${u.id!==data.me.id?`<div class="field"><label>Account access</label><select name="enabled"><option value="true" ${u.enabled?'selected':''}>Active</option><option value="false" ${!u.enabled?'selected':''}>Disabled</option></select><small>Disabled members cannot sign in or receive new assignments.</small></div>`:''}<div style="display:flex;justify-content:flex-end;gap:8px"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">${I('check')} Save changes</button></div></form>`;
 return modalFrame('Edit team member','WORKSPACE MEMBERS',body,'','medium');
}
function newMemberModal(){const body=`<form id="new-member-form"><div class="field-grid"><div class="field"><label>Full name <span class="required-star">*</span></label><input required maxlength="90" name="name" placeholder="Full name"></div><div class="field"><label>Email <span class="required-star">*</span></label><input required type="email" name="email" placeholder="name@company.com"></div><div class="field"><label>Job title</label><input maxlength="80" name="title" placeholder="Project manager"></div><div class="field"><label>Workspace role</label><select name="role"><option value="MEMBER">Member</option>${data.me.role==='ADMIN'?'<option value="MANAGER">Manager</option><option value="ADMIN">Administrator</option>':''}</select></div></div><div class="field"><label>Initial password <span class="required-star">*</span></label><input name="password" type="password" required minlength="12" placeholder="At least 12 characters"><small>Share the initial password with this team member through a secure channel.</small></div><div style="display:flex;justify-content:flex-end;gap:8px"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">${I('plus')} Add team member</button></div></form>`;return modalFrame('Add a team member','WORKSPACE MEMBERS',body,'','medium');}
function membersModal(){let p=prj(state.projectId),ids=memberIds(p.id),canEdit=isManagerOf(p);
 let body=`<p class="subtitle" style="margin:0 0 19px">Select who can view, collaborate on, and receive tasks in ${E(p.name)}.</p>
 ${canEdit?`<form id="invite-project-member-form" class="invite-member-form" data-id="${A(p.id)}"><label for="invite-email">Add a registered teammate by email</label><div class="invite-member-row"><input id="invite-email" name="email" type="email" required maxlength="160" autocomplete="email" placeholder="teammate@company.com"><button type="submit" class="btn primary">${I('plus')} Add member</button></div><small>They can access this project once you add them. No workspace administrator approval is needed.</small></form>`:''}<form id="project-members-form"><div class="checkbox-list">${data.members.filter(u=>u.enabled).map(u=>`<label class="check-person"><input type="checkbox" name="memberId" value="${A(u.id)}" ${ids.has(u.id)?'checked':''} ${!canEdit||u.id===p.leadId?'disabled':''}>${avatar(u,'avatar-sm')}<span><strong>${E(displayName(u))}</strong><small>${E(u.title||'Member')}${u.id===p.leadId?' · Lead':''}</small></span></label>`).join('')}</div>${canEdit?`<div style="display:flex;justify-content:flex-end;gap:9px;margin-top:23px"><button type="button" class="btn" data-action="close-modal">Cancel</button><button type="submit" class="btn primary">${I('check')} Save team</button></div>`:''}</form>`;
 return modalFrame('Manage project team',p.name,body,'','medium');
}
function memberTasksPage(){const u=who(state.memberId);if(!u)return teamPage();const assigned=data.tasks.filter(t=>t.assigneeId===u.id),m=metrics(assigned);return `${pageHeader(displayName(u),`${u.title||'Team member'} · ${cap(u.role)} · ${u.email}`,`<button class="btn" data-action="nav" data-page="team">${I('chevronLeft')} Back to team</button>`,['Team',displayName(u)])}<div class="stat-grid">${statCard('Assigned tasks',m.count,'Across all projects','layers')}${statCard('In progress',m.inProgress,'Active responsibilities','pulse')}${statCard('Completed',m.done,`${m.completion}% complete`,'checkCircle','green')}${statCard('Overdue',m.overdue,'Past their due dates','alert','rose')}</div><div class="panel-header"><h2 class="panel-title">Assigned responsibilities</h2></div>${taskTable(assigned)}`;}
function searchPage(){const q=state.globalSearch.trim().toLowerCase();const results=q?allTasks().filter(t=>`${t.title} ${t.description} ${t.key} ${prj(t.projectId)?.name}`.toLowerCase().includes(q)):[];
 return `${pageHeader('Search results',q?`${results.length} task${results.length===1?'':'s'} found for “${state.globalSearch}”`:'Search by task title, key, description, or project.', '', ['Search'])}${results.length?taskTable(results):empty('Nothing found yet','Try a different search phrase.','search')}`;}
const originalRender=render;
render=function(){
 if(state.page!=='search')return originalRender();
 const app=document.getElementById('app');
 app.innerHTML=`<div class="app-shell">${sidebar()}<div class="main-area">${topbar()}<main class="content">${searchPage()}</main></div>${state.mobileMenu?`<button class="sidebar-shade" data-action="close-menu" aria-label="Close menu"></button>`:''}</div>`;
 document.getElementById('overlays').innerHTML=state.modal?modalHtml(state.modal):'';
 document.title='Search · Tasky';
};
function openModal(type,extra={}){state.modal={type,...extra};state.notice=false;render();setTimeout(()=>document.querySelector('.overlay input[autofocus]')?.focus(),0);}
function closeModal(){state.modal=null;render();}
async function perform(kind,payload,id,success){
 try{await action(kind,payload,id);state.modal=null;render();if(success)toast(success);return true;}
 catch(e){
  console.error(`Tasky ${kind} failed`,e);
  if(e.status===409){
   try{await refresh();render();}catch(refreshError){console.error('Could not refresh after conflict',refreshError);}
   toast(e.message||'Task was changed by another person. Workspace refreshed; please try again.',true);
  }else if(e.status>=500){toast(`Tasky server error (${e.status}). Open the Spring Boot terminal for details.`,true);}
  else toast(e.message||'Something went wrong',true);
  return false;
 }
}
function onClick(e){
 const el=e.target.closest('[data-action]');if(!el)return;
 const a=el.dataset.action,id=el.dataset.id;
 if(a==='backdrop'){if(e.target===el)closeModal();return;}
 if(a==='nav'){setPage(el.dataset.page);return;}
 if(a==='project'){state.view='board';setPage(`project/${id}/board`);return;}
 if(a==='subpage'){state.search='';setPage(`project/${state.projectId}/${el.dataset.page}`);return;}
 if(a==='board-view'){state.page='board';state.view=el.dataset.view;render();return;}
 if(a==='close-menu'){state.mobileMenu=false;render();return;}
 if(a==='mobile-menu'){state.mobileMenu=true;render();return;}
 if(a==='modal-task'){if(!data.projects.length){openModal('project');toast('Create a project first, then you can add tasks.');return;}openModal('newTask',{projectId:state.projectId||data.projects[0].id,status:el.dataset.status||'TODO'});return;}
 if(a==='modal-project'){openModal('project');return;}
 if(a==='modal-member'){if(canManage())openModal('member');else toast('Manager permission required',true);return;}
 if(a==='member-tasks'){state.memberId=id;state.page='member-tasks';render();return;}
 if(a==='edit-member'){if(canManage())openModal('editMember',{id});else toast('Manager permission required',true);return;}
 if(a==='modal-members'){openModal('members');return;}
 if(a==='open-task'){openModal('task',{id});state.detailTab='comments';return;}
 if(a==='close-modal'){closeModal();return;}
 if(a==='detail-tab'){state.detailTab=el.dataset.tab;render();return;}
 if(a==='profile'){openModal('profile');return;}
 if(a==='change-password'){openModal('password');return;}
 if(a==='help'){openModal('help');return;}
 if(a==='notifications'){state.notice=!state.notice;render();return;}
 if(a==='post-comment'){
  e.preventDefault();const input=document.getElementById('comment-draft');const body=input?.value.trim();if(!body){toast('Write a comment first',true);return;}
  perform('comment',{body},id,'Comment posted');return;
 }
 if(a==='delete-project'){
  const p=prj(id);if(!p||!isManagerOf(p))return;
  if(prompt(`Permanently delete ${p.name} and all its tasks, comments, and activity? Type ${p.key} to confirm:`)===p.key)perform('deleteProject',{},id,'Project deleted');
  return;
 }
 if(a==='delete-task'){
  const t=taskById(id);if(!t||!isManagerOf(prj(t.projectId)))return;
  if(confirm(`Delete ${t.key}? This cannot be undone.`))perform('deleteTask',{},id,'Task deleted');return;
 }
 if(a==='export-csv'){exportTasks(el.dataset.project);return;}
 if(a==='export-activity'){exportActivity();return;}
 if(a==='logout'){
  (async()=>{try{if(!csrfToken)await getCsrf();await fetch('/logout',{method:'POST',credentials:'same-origin',headers:{'X-XSRF-TOKEN':csrfToken}});location.href='/login.html?logout';}catch(e){toast('Could not sign out',true);}})();return;
 }
}
function onChange(e){
 const el=e.target;
 if(el.id==='priority-filter'){state.filterPriority=el.value;render();}
 if(el.id==='member-filter'){state.filterMember=el.value;render();}
 if(el.id==='my-filter'){state.myFilter=el.value;render();}
 if(el.id==='task-project'){
  const assigned=document.getElementById('task-assignee');
  if(assigned)assigned.innerHTML=optionMembers(el.value,state.page==='my-tasks'&&memberIds(el.value).has(data.me.id)?data.me.id:'');
 }
}
function inputRerenderPreserveFocus(id,value,prop){
 state[prop]=value;const old=document.getElementById(id);const pos=old?.selectionStart||value.length;
 render();const next=document.getElementById(id);if(next){next.focus();try{next.setSelectionRange(pos,pos)}catch{}}
}
function onInput(e){
 if(e.target.id==='task-search'){inputRerenderPreserveFocus('task-search',e.target.value,'search');return;}
 if(e.target.id==='global-search'){
  const s=e.target.value;
  state.globalSearch=s;state.page='search';
  inputRerenderPreserveFocus('global-search',s,'globalSearch');return;
 }
 if(e.target.id==='new-project-name'){
  const key=document.getElementById('new-project-key');
  if(key&&!key.dataset.edited){const parts=e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g,' ').split(/\s+/).filter(Boolean);let suggested=parts.length>1?parts.map(x=>x[0]).join('').slice(0,10):(parts[0]||'').slice(0,10);if(suggested.length<2&&parts[0])suggested=parts[0].slice(0,2);key.value=suggested;}
 }
 if(e.target.id==='new-project-key')e.target.dataset.edited='1';
}
function values(form){const fd=new FormData(form);return Object.fromEntries([...fd.entries()].map(([k,v])=>[k,typeof v==='string'?v.trim():v]));}
function onSubmit(e){
 const f=e.target;if(!f.id)return;
 if(!['new-task-form','edit-task-form','new-project-form','new-member-form','edit-member-form','project-members-form','invite-project-member-form','project-settings-form','password-form'].includes(f.id))return;
 e.preventDefault();
 const v=values(f);
 if(f.id==='password-form'){
  if(v.newPassword!==v.confirmPassword){toast('New passwords do not match',true);return;}
  perform('password',{currentPassword:v.currentPassword,newPassword:v.newPassword},null,'Your password has been updated');return;
 }
 if(f.id==='invite-project-member-form'){
  const email=v.email?.toLowerCase();
  if(!email){toast('Enter a teammate email',true);return;}
  perform('inviteProjectMember',{email},f.dataset.id,'Teammate added to your project');return;
 }
 if(f.id==='new-task-form'){
  if(!v.title){toast('Enter a task title',true);return;}
  perform('newTask',{...v,dueDate:v.dueDate||null,assigneeId:v.assigneeId||null},null,'Task created successfully');return;
 }
 if(f.id==='edit-task-form'){
  perform('updateTask',{...v,dueDate:v.dueDate||null,assigneeId:v.assigneeId||null},f.dataset.id,'Task updated');return;
 }
 if(f.id==='new-project-form'){
  v.key=v.key.toUpperCase();
  if(data.projects.some(p=>p.key===v.key)){toast('Project key already exists',true);return;}
  if(v.targetDate&&v.startDate&&v.targetDate<v.startDate){toast('Target date must come after the start date',true);return;}
  perform('newProject',{...v,startDate:v.startDate||null,targetDate:v.targetDate||null},null,'Project created');return;
 }
 if(f.id==='edit-member-form'){
  if('enabled' in v)v.enabled=v.enabled==='true';
  perform('updateMember',v,f.dataset.id,'Team member updated');return;
 }
 if(f.id==='new-member-form'){
  if(data.members.some(u=>u.email.toLowerCase()===v.email.toLowerCase())){toast('This email is already in use',true);return;}
  perform('newMember',{...v,color:['indigo','violet','teal','orange','rose'][data.members.length%5]},null,'Team member added');return;
 }
 if(f.id==='project-members-form'){
  const fd=new FormData(f),members=fd.getAll('memberId');
  perform('projectMembers',{memberIds:[...members,prj(state.projectId).leadId]},state.projectId,'Project team updated');return;
 }
 if(f.id==='project-settings-form'){
  if(v.targetDate&&v.startDate&&v.targetDate<v.startDate){toast('Target date must come after the start date',true);return;}
  perform('updateProject',{...v,startDate:v.startDate||null,targetDate:v.targetDate||null},state.projectId,'Project settings saved');return;
 }
}
function onKey(e){
 const typing=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
 if(e.key==='Escape'){if(state.modal){closeModal();return;}if(state.notice){state.notice=false;render();}return;}
 if(!typing&&!state.modal&&e.key==='/'){e.preventDefault();document.getElementById('global-search')?.focus();return;}
 if(!typing&&!state.modal&&e.key.toLowerCase()==='n'&&data.projects.length){e.preventDefault();openModal('newTask',{projectId:state.projectId||data.projects[0].id});return;}
 if(e.key==='Enter'&&e.target.matches('.task-card[role="button"],.project-tile[role="button"],.member-card[role="button"]')){e.preventDefault();e.target.click();}
}
let draggedId=null;
const pendingStatusUpdates=new Set();
function onDragStart(e){const c=e.target.closest('.task-card');if(!c)return;draggedId=c.dataset.task;
 e.dataTransfer.setData('text/plain',draggedId);e.dataTransfer.effectAllowed='move';requestAnimationFrame(()=>c.classList.add('dragging'));
}
function onDragEnd(){draggedId=null;document.querySelectorAll('.drag-over').forEach(e=>e.classList.remove('drag-over'));document.querySelectorAll('.dragging').forEach(e=>e.classList.remove('dragging'));}
function onDragOver(e){let col=e.target.closest('.board-column');if(!col||!draggedId)return;e.preventDefault();e.dataTransfer.dropEffect='move';col.classList.add('drag-over');}
function onDragLeave(e){let col=e.target.closest('.board-column');if(col&&!col.contains(e.relatedTarget))col.classList.remove('drag-over');}
function onDrop(e){let col=e.target.closest('.board-column');if(!col)return;e.preventDefault();const id=draggedId||e.dataTransfer.getData('text/plain');const t=taskById(id),next=col.dataset.status;
 onDragEnd();if(!t||!next||t.status===next)return;
 if(pendingStatusUpdates.has(id))return;
 pendingStatusUpdates.add(id);
 perform('status',{status:next,version:t.version},id,`Moved to ${cap(STATUS_NAMES[next])}`).finally(()=>pendingStatusUpdates.delete(id));
}
function csvDownload(filename,head,rows){
 const quote=x=>{let v=String(x??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return `"${v.replaceAll('"','""')}"`;};
 const csv='\ufeff'+[head,...rows].map(row=>row.map(quote).join(',')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 toast('CSV file exported');
}
function exportTasks(pid){let ts=pid?projectTasks(pid):allTasks();csvDownload(`Tasky-tasks-${dateToday()}.csv`,['Task ID','Project','Title','Status','Priority','Category','Assignee','Due date','Created at','Updated at'],ts.map(t=>[t.key,prj(t.projectId)?.name,t.title,t.status,t.priority,t.category,who(t.assigneeId)?.name||'',t.dueDate,t.createdAt,t.updatedAt]));}
async function exportActivity(){
 try {
  const full=await api('GET','/reports/activity');
  csvDownload(`Tasky-activity-${dateToday()}.csv`,['Date','Project','Member','Event','Description','Task'],full.map(a=>[a.createdAt,prj(a.projectId)?.name,who(a.actorId)?.name,a.type,a.message,taskById(a.taskId)?.key||'']));
 }catch(e){toast(e.message||'Could not export activity',true);}
}

load();
