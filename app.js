const KEY='thrive-companion-v1';
const blank=()=>({chapters:[],journal:[],exercises:[],beliefs:[],toolkit:[],checkins:[]});
let data=load(),view='dashboard';
function load(){try{return {...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return blank()}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dateNow(){return new Date().toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'})}
document.getElementById('todayLabel').textContent=dateNow();
const content=document.getElementById('content');
function go(v){view=v;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));render();window.scrollTo(0,0)}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
function toast(t){let x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
function header(ey,title,sub){return `<div class="eyebrow">${ey}</div><h1 class="page-title">${title}</h1><p class="subtitle">${sub}</p>`}
function countDone(){return data.chapters.filter(x=>x.done).length}
function render(){
 const mobileNav=`<nav class="bottom-nav">${[['dashboard','⌂','Home'],['programme','▤','Learn'],['journal','▧','Journal'],['beliefs','◉','Beliefs'],['progress','↗','Progress']].map(([v,i,l])=>`<button data-view="${v}" class="${view===v?'active':''}"><span>${i}</span>${l}</button>`).join('')}</nav>`;
 let html='';
 if(view==='dashboard') html=dashboard();
 if(view==='programme') html=programme();
 if(view==='journal') html=journal();
 if(view==='exercises') html=exercises();
 if(view==='beliefs') html=beliefs();
 if(view==='toolkit') html=toolkit();
 if(view==='progress') html=progress();
 if(view==='settings') html=settings();
 content.innerHTML=html+mobileNav;
 content.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
 content.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>actions(b.dataset.action,b.dataset.id,b.dataset.type)));
}
function dashboard(){
 let latest=data.journal.slice().sort((a,b)=>b.created-a.created)[0];
 return `<section class="hero"><div class="eyebrow">YOUR PERSONAL DEVELOPMENT SPACE</div><h1>Your journey.<br>One step at a time.</h1><p>A dedicated place to learn, reflect and put Thrive into practice in everyday life. Small steps count.</p><button class="btn light" data-view="programme">Continue my programme →</button></section>
 <div class="grid stats"><div class="stat"><div class="stat-label">CHAPTERS COMPLETED</div><div class="stat-value">${countDone()}</div><div class="stat-foot">Keep building your foundation</div></div><div class="stat"><div class="stat-label">REFLECTIONS SAVED</div><div class="stat-value">${data.journal.length}</div><div class="stat-foot">Your thoughts, captured</div></div><div class="stat"><div class="stat-label">TOOLS COLLECTED</div><div class="stat-value">${data.toolkit.length}</div><div class="stat-foot">Helpful ideas to revisit</div></div></div>
 <div class="section-head"><div><h2>Your workspace</h2><p>Everything you need, in one place.</p></div></div>
 <div class="grid quick-grid">
 ${card('▤','My programme','Organise chapters, lessons and notes.','programme')}
 ${card('✎','Exercises','Capture answers and work through activities.','exercises')}
 ${card('▧','Journal & reflections','Make space for thoughts and learning.','journal')}
 ${card('◉','Beliefs','Explore old beliefs and more helpful alternatives.','beliefs')}
 ${card('✧','My toolkit','Save techniques, reminders and useful insights.','toolkit')}
 ${card('↗','My progress','See the work you have captured over time.','progress')}
 </div>
 <div class="grid two-col" style="margin-top:22px"><div class="panel"><h3>Recent reflection</h3>${latest?`<div class="entry"><div class="entry-head">${new Date(latest.created).toLocaleDateString()} <span>${esc(latest.category||'Reflection')}</span></div><h4>${esc(latest.title)}</h4><p>${esc(latest.body.slice(0,220))}${latest.body.length>220?'…':''}</p></div>`:`<div class="empty"><strong>Your reflections will appear here.</strong>Capture a thought, insight or moment from your day.</div>`}</div><div class="panel"><h3>A gentle reminder</h3><p style="font-size:13px;line-height:1.7;color:#65736a">You don't need to change everything today. Notice what you're learning, practise it in real situations and give yourself credit for the steps you take.</p><span class="pill">1% better every day</span></div></div>`;
}
function card(icon,title,desc,v){return `<button class="feature-card" data-view="${v}"><span class="feature-icon">${icon}</span><b>${title}</b><small>${desc}</small></button>`}
function programme(){
 let chapters=data.chapters;
 return `${header('LEARN & DEVELOP','My programme','Build your own Thrive library. Add chapters and lessons as you work through your material.')}
 <div class="toolbar"><input id="chapterSearch" placeholder="Search your chapters…"><button class="btn" data-action="add-chapter">+ Add chapter</button></div>
 <div class="notice">Add your own chapter titles, summaries and notes. This starter app does not include Thrive course material; you can enter content you have access to and are entitled to use.</div>
 <div id="chapterList" class="grid chapter-grid">${chapters.length?chapters.map(ch=>`<article class="chapter" data-search="${esc((ch.title+' '+ch.summary).toLowerCase())}"><div class="num">CHAPTER ${esc(ch.number||'—')}</div><h3>${esc(ch.title)}</h3><p>${esc(ch.summary||'Add a short description of what this chapter covers.')}</p><div class="progress-track"><div class="progress-fill" style="width:${ch.done?100:0}%"></div></div><div class="chapter-foot"><span class="pill">${ch.done?'Completed':'In progress'}</span><button class="btn outline small" data-action="toggle-chapter" data-id="${ch.id}">${ch.done?'Reopen':'Mark done'}</button></div><div class="actions"><button class="btn outline small" data-action="edit-chapter" data-id="${ch.id}">Edit</button><button class="btn outline small" data-action="delete-chapter" data-id="${ch.id}">Delete</button></div></article>`).join(''):`<div class="empty" style="grid-column:1/-1"><strong>Your programme library starts here.</strong>Add your first chapter to begin organising your learning.</div>`}</div>`;
}
function journal(){
 return `${header('THINK · NOTICE · REFLECT','Journal & reflections','Capture insights, questions, experiences and the things you notice in everyday life.')}
 <div class="panel"><h3>New reflection</h3><div class="field"><label>Title</label><input id="jTitle" placeholder="What has been on my mind?"></div><div class="field"><label>Type</label><select id="jCategory"><option>Daily reflection</option><option>Learning insight</option><option>Real-life application</option><option>Challenge</option><option>Gratitude</option></select></div><div class="field"><label>Your reflection</label><textarea id="jBody" placeholder="What happened? What did I notice? What might I take from it?"></textarea></div><button class="btn" data-action="save-journal">Save reflection</button></div>
 <div class="section-head"><div><h2>Past reflections</h2><p>${data.journal.length} saved entries</p></div></div>${entries(data.journal,'journal')}`;
}
function exercises(){
 return `${header('PUT LEARNING INTO PRACTICE','My exercises','Keep your exercise prompts and answers together. Return to them whenever you want.')}
 <div class="panel"><h3>Add an exercise</h3><div class="field"><label>Exercise name</label><input id="eTitle" placeholder="e.g. Exploring a belief"></div><div class="field"><label>Chapter or topic (optional)</label><input id="eTopic" placeholder="Which chapter does this relate to?"></div><div class="field"><label>Prompt / instructions</label><textarea id="ePrompt" placeholder="Add the exercise instructions in your own words…"></textarea></div><div class="field"><label>My answers and reflections</label><textarea id="eAnswer" placeholder="Work through the exercise here…"></textarea></div><button class="btn" data-action="save-exercise">Save exercise</button></div>
 <div class="section-head"><div><h2>Saved exercises</h2><p>${data.exercises.length} exercises</p></div></div>${entries(data.exercises,'exercise')}`;
}
function beliefs(){
 return `${header('QUESTION · EXPLORE · REFRAME','Beliefs','A private space to notice beliefs, examine the evidence and consider more helpful alternatives.')}
 <div class="notice">This is a reflection tool, not a test. You can revisit and update an entry as your thinking develops.</div>
 <div class="panel"><h3>Explore a belief</h3><div class="field"><label>Belief I'm noticing</label><textarea id="bOld" placeholder="What am I telling myself?"></textarea></div><div class="field"><label>Where might this belief come from?</label><textarea id="bSource" placeholder="Experiences, assumptions or things I've learned…"></textarea></div><div class="field"><label>What evidence supports or challenges it?</label><textarea id="bEvidence" placeholder="Look at the evidence with curiosity…"></textarea></div><div class="field"><label>A more helpful, balanced belief</label><textarea id="bNew" placeholder="What could I choose to believe instead?"></textarea></div><button class="btn" data-action="save-belief">Save belief reflection</button></div>
 <div class="section-head"><div><h2>My belief reflections</h2><p>${data.beliefs.length} saved</p></div></div>${entries(data.beliefs,'belief')}`;
}
function toolkit(){
 return `${header('KEEP WHAT HELPS','My toolkit','Collect useful techniques, reminders, questions and insights you want to return to.')}
 <div class="panel"><h3>Add to your toolkit</h3><div class="field"><label>Title</label><input id="tTitle" placeholder="A technique or reminder"></div><div class="field"><label>Type</label><select id="tType"><option>Technique</option><option>Helpful reminder</option><option>Question to revisit</option><option>Key insight</option><option>Personal note</option></select></div><div class="field"><label>Details</label><textarea id="tBody" placeholder="Write it in a way that makes sense to you…"></textarea></div><button class="btn" data-action="save-tool">Save to toolkit</button></div>
 <div class="section-head"><div><h2>Saved tools</h2><p>${data.toolkit.length} items</p></div></div>${entries(data.toolkit,'tool')}`;
}
function entries(arr,type){
 if(!arr.length)return `<div class="empty"><strong>Nothing saved here yet.</strong>When you add an entry, it will be kept here for you to revisit.</div>`;
 return arr.slice().sort((a,b)=>b.created-a.created).map(x=>`<article class="entry"><div class="entry-head"><span>${new Date(x.created).toLocaleDateString()} · ${esc(x.category||x.topic||x.type||'Entry')}</span><div class="entry-actions"><button data-action="delete-entry" data-id="${x.id}" data-type="${type}">Delete</button></div></div><h4>${esc(x.title||x.old||'Reflection')}</h4><p>${esc(x.body||x.answer||x.newBelief||'')}</p>${x.prompt?`<p class="muted" style="margin-top:8px">Prompt: ${esc(x.prompt)}</p>`:''}${x.topic?`<p class="muted" style="margin-top:6px">Topic: ${esc(x.topic)}</p>`:''}${x.source?`<p style="margin-top:8px"><b>Context:</b> ${esc(x.source)}</p>`:''}${x.evidence?`<p style="margin-top:8px"><b>Evidence:</b> ${esc(x.evidence)}</p>`:''}${x.newBelief?`<p style="margin-top:8px"><b>Alternative:</b> ${esc(x.newBelief)}</p>`:''}</article>`).join('');
}
function progress(){
 let total=data.chapters.length,done=countDone(),pct=total?Math.round(done/total*100):0;
 return `${header('LOOK BACK & NOTICE','My progress','Your progress is more than a number. This page gives you a snapshot of the work you have captured.')}
 <div class="grid stats"><div class="stat"><div class="stat-label">CHAPTERS COMPLETED</div><div class="stat-value">${done}/${total}</div><div class="stat-foot">Programme progress</div></div><div class="stat"><div class="stat-label">JOURNAL ENTRIES</div><div class="stat-value">${data.journal.length}</div><div class="stat-foot">Thoughts and reflections</div></div><div class="stat"><div class="stat-label">EXERCISES</div><div class="stat-value">${data.exercises.length}</div><div class="stat-foot">Saved activities</div></div></div>
 <div class="panel"><div class="section-head" style="margin-top:0"><h2>Programme completion</h2><b>${pct}%</b></div><div class="progress-track" style="height:11px"><div class="progress-fill" style="width:${pct}%"></div></div><p class="muted" style="font-size:11px;margin-top:12px">${total?`${done} of ${total} chapters marked complete.`:'Add chapters to start tracking your programme.'}</p></div>
 <div class="grid two-col" style="margin-top:16px"><div class="panel"><h3>Your activity</h3>${[['Reflections',data.journal.length],['Exercises',data.exercises.length],['Belief explorations',data.beliefs.length],['Toolkit items',data.toolkit.length]].map(([n,v])=>`<div class="list-row"><span>${n}</span><b>${v}</b></div>`).join('')}</div><div class="panel"><h3>A note on progress</h3><p style="font-size:12px;color:#647169;line-height:1.7">Use these numbers as a record of activity, not a judgement of how well you're doing. A meaningful insight or a small change in everyday life can matter more than ticking off a box.</p></div></div>`;
}
function settings(){
 return `${header('YOUR DATA','Settings & backup','Your entries are stored in this browser on this device. Export a backup regularly.')}
 <div class="panel"><h3>Backup your Thrive Companion data</h3><p class="muted" style="font-size:12px;line-height:1.7">Export creates a JSON backup of your chapters, journal entries, exercises, beliefs and toolkit. Keep it somewhere private. Importing a backup replaces the current data in this browser.</p><div class="actions"><button class="btn" data-action="export">Export my data</button><label class="btn outline" for="importFile">Import backup</label><input id="importFile" type="file" accept="application/json" hidden></div><div class="notice">Important: GitHub Pages hosts the app files, but your personal entries are saved in this browser's local storage. They do not automatically sync between devices or browsers. Clearing browser data can remove them, so keep backups.</div></div>
 <div class="panel" style="margin-top:15px"><h3>Reset local data</h3><p class="muted" style="font-size:12px">This permanently clears entries stored in this browser. Export a backup first if you may need them.</p><button class="btn danger" data-action="reset">Clear all my data</button></div>`;
}
function actions(a,id,type){
 const val=x=>document.getElementById(x)?.value.trim()||'';
 if(a==='add-chapter'){let title=prompt('Chapter title?');if(!title)return;let number=prompt('Chapter number (optional):')||'';let summary=prompt('Short description (optional):')||'';data.chapters.push({id:crypto.randomUUID(),title,number,summary,done:false});save();render();toast('Chapter added');}
 if(a==='edit-chapter'){let x=data.chapters.find(x=>x.id===id);if(!x)return;let title=prompt('Chapter title:',x.title);if(title===null)return;x.title=title;x.summary=prompt('Description:',x.summary)||'';save();render();toast('Chapter updated');}
 if(a==='delete-chapter'&&confirm('Delete this chapter?')){data.chapters=data.chapters.filter(x=>x.id!==id);save();render();toast('Chapter deleted')}
 if(a==='toggle-chapter'){let x=data.chapters.find(x=>x.id===id);x.done=!x.done;save();render();toast('Progress updated')}
 if(a==='save-journal'){if(!val('jTitle')||!val('jBody'))return toast('Add a title and reflection first');data.journal.push({id:crypto.randomUUID(),title:val('jTitle'),category:val('jCategory'),body:val('jBody'),created:Date.now()});save();render();toast('Reflection saved')}
 if(a==='save-exercise'){if(!val('eTitle'))return toast('Add an exercise name first');data.exercises.push({id:crypto.randomUUID(),title:val('eTitle'),topic:val('eTopic'),prompt:val('ePrompt'),answer:val('eAnswer'),created:Date.now()});save();render();toast('Exercise saved')}
 if(a==='save-belief'){if(!val('bOld'))return toast('Add the belief you want to explore');data.beliefs.push({id:crypto.randomUUID(),old:val('bOld'),title:'Belief reflection',source:val('bSource'),evidence:val('bEvidence'),newBelief:val('bNew'),created:Date.now()});save();render();toast('Belief reflection saved')}
 if(a==='save-tool'){if(!val('tTitle')||!val('tBody'))return toast('Add a title and details');data.toolkit.push({id:crypto.randomUUID(),title:val('tTitle'),type:val('tType'),body:val('tBody'),created:Date.now()});save();render();toast('Added to your toolkit')}
 if(a==='delete-entry'&&confirm('Delete this entry?')){let k={journal:'journal',exercise:'exercises',belief:'beliefs',tool:'toolkit'}[type];data[k]=data[k].filter(x=>x.id!==id);save();render();toast('Entry deleted')}
 if(a==='export'){let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),link=document.createElement('a');link.href=u;link.download='thrive-companion-backup-'+new Date().toISOString().slice(0,10)+'.json';link.click();URL.revokeObjectURL(u);toast('Backup downloaded')}
 if(a==='reset'&&confirm('Are you absolutely sure? This cannot be undone unless you have a backup.')){data=blank();save();render();toast('Local data cleared')}
}
document.addEventListener('change',e=>{if(e.target.id==='importFile'){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);if(!d||typeof d!=='object')throw 0;if(!confirm('Import this backup and replace current local data?'))return;data={...blank(),...d};save();render();toast('Backup imported')}catch(_){alert('That file could not be read as a Thrive Companion backup.')}};r.readAsText(f)}});
document.addEventListener('input',e=>{if(e.target.id==='chapterSearch'){let q=e.target.value.toLowerCase();document.querySelectorAll('[data-search]').forEach(x=>x.style.display=x.dataset.search.includes(q)?'':'none')}});
render();
