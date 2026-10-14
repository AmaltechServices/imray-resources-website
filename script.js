const products=[
 {name:'ABC Dry Powder Extinguisher',cat:'extinguisher',photo:'abc-powder-real.webp',desc:'A versatile dry powder extinguisher category for initial equipment enquiries.',application:'General equipment enquiry'},
 {name:'CO₂ Fire Extinguisher',cat:'extinguisher',photo:'co2-real.webp',desc:'Carbon dioxide extinguisher category. Confirm the appropriate application with a competent fire safety professional.',application:'Equipment type enquiry'},
 {name:'Foam / Water Extinguisher',cat:'extinguisher',photo:'foam-real.webp',desc:'Foam and water extinguisher options. Exact agent, rating and application require confirmation.',application:'Agent and capacity enquiry'},
 {name:'Fire Hose Reel',cat:'system',photo:'hose-reel.webp',desc:'Fire hose reel equipment and related site requirements for discussion.',application:'Building equipment enquiry'},
 {name:'Fire Alarm & Detectors',cat:'system',photo:'fire-alarm.webp',desc:'Fire detection and alarm system enquiries for different premises.',application:'System enquiry'},
 {name:'Sprinkler / Hydrant Enquiry',cat:'system',photo:'sprinkler.webp',desc:'Discuss potential sprinkler or hydrant requirements with the service team.',application:'Technical scope enquiry'},
 {name:'Emergency Exit Signage',cat:'accessory',photo:'emergency-light.webp',desc:'Emergency exit signage and related safety accessory enquiries.',application:'Signage enquiry'},
 {name:'Fire Blanket & Cabinet',cat:'accessory',photo:'accessories.webp',desc:'Fire blankets, storage cabinets and related accessories.',application:'Accessory enquiry'}
];
const selected=new Map();let current='all',active=0;
const list=document.getElementById('consoleProductList');
const catLabel={extinguisher:'FIRE EXTINGUISHER',system:'FIRE PROTECTION SYSTEM',accessory:'SAFETY ACCESSORY'};
function visibleIndices(){return products.map((p,i)=>i).filter(i=>current==='all'||products[i].cat===current)}
function choose(i){active=i;const p=products[i];document.getElementById('stageImage').src='./images/'+p.photo;document.getElementById('stageImage').alt=p.name+' — equipment image';document.getElementById('stageIndex').textContent=String(i+1).padStart(2,'0')+' / 08';document.getElementById('detailCode').textContent='EQ-'+String(i+1).padStart(3,'0');document.getElementById('detailName').textContent=p.name;document.getElementById('detailDesc').textContent=p.desc;document.getElementById('detailCategory').textContent=catLabel[p.cat];document.getElementById('detailApplication').textContent=p.application;document.getElementById('consoleAdd').textContent=selected.has(p.name)?'✓ ADDED — REMOVE ITEM':'+ ADD TO ENQUIRY';renderList()}
function renderList(){list.replaceChildren();visibleIndices().forEach(i=>{const p=products[i];const b=document.createElement('button');b.type='button';b.className='console-item'+(i===active?' is-current':'');b.setAttribute('aria-pressed',String(i===active));const n=document.createElement('span');n.className='console-item-num';n.textContent=String(i+1).padStart(2,'0');const name=document.createElement('span');name.textContent=p.name;const mark=document.createElement('span');mark.className='console-item-mark';mark.textContent=selected.has(p.name)?'✓':'↗';b.append(n,name,mark);b.addEventListener('click',()=>choose(i));list.append(b)})}
function updateCount(){document.getElementById('selectionCount').textContent=selected.size+' product type'+(selected.size===1?'':'s')+' selected';const chips=document.getElementById('enquiryChips');chips.replaceChildren();if(!selected.size){const empty=document.createElement('span');empty.className='empty-selection';empty.textContent='No equipment added yet.';chips.append(empty)}else{selected.forEach((qty,name)=>{const b=document.createElement('button');b.type='button';b.className='enquiry-chip';b.textContent=name+' × (remove)';b.title='Remove '+name;b.addEventListener('click',()=>{selected.delete(name);updateCount();choose(active)});chips.append(b);const q=document.createElement('input');q.type='number';q.min='1';q.max='99999';q.value=String(qty);q.className='rfq-qty';q.setAttribute('aria-label','Quantity for '+name);q.addEventListener('change',()=>{const val=Math.max(1,Math.min(99999,Number(q.value)||1));selected.set(name,val);q.value=String(val);updateCount()});chips.append(q)})}}
document.querySelectorAll('[data-console-filter]').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.consoleFilter;document.querySelectorAll('[data-console-filter]').forEach(x=>x.classList.toggle('active',x===b));const v=visibleIndices();if(!v.includes(active))active=v[0];choose(active)}));
document.getElementById('consoleAdd').addEventListener('click',()=>{const name=products[active].name;selected.has(name)?selected.delete(name):selected.set(name,1);updateCount();choose(active)});
document.getElementById('consoleNext').addEventListener('click',()=>{const v=visibleIndices();choose(v[(v.indexOf(active)+1)%v.length])});
const facilityBrief=document.getElementById('facilityBrief'),equipmentStudio=document.getElementById('equipmentStudio');
function showPath(which){const guided=which==='guided';facilityBrief.hidden=!guided;equipmentStudio.hidden=guided;document.getElementById('pathSolution').classList.toggle('active',guided);document.getElementById('pathEquipment').classList.toggle('active',!guided);document.getElementById('pathSolution').setAttribute('aria-pressed',String(guided));document.getElementById('pathEquipment').setAttribute('aria-pressed',String(!guided));}
document.getElementById('pathSolution').addEventListener('click',()=>showPath('guided'));
document.getElementById('pathEquipment').addEventListener('click',()=>showPath('equipment'));
let facilitySummary='';
document.getElementById('facilityForm').addEventListener('submit',e=>{e.preventDefault();const type=document.getElementById('facilityType').value,need=document.getElementById('facilityNeed').value,stage=document.getElementById('facilityStage').value,loc=document.getElementById('facilityLocation').value.trim(),notes=document.getElementById('facilityNotes').value.trim();facilitySummary=['Facility Type: '+type,'Requirement: '+need,'Project Stage: '+stage,'Facility Location: '+(loc||'To be confirmed'),'Site Notes: '+(notes||'Not specified')].join('\n');openQuote('Industrial Facility Enquiry');document.getElementById('serviceSelect').value=need.includes('Assessment')?'Site Assessment / Technical Consultation Enquiry':'Industrial Facility Enquiry';document.getElementById('quoteForm').elements.details.value=facilitySummary;if(loc)document.getElementById('quoteForm').elements.location.value=loc;});
choose(0);updateCount();
const menu=document.getElementById('navlinks');document.getElementById('hamburger').addEventListener('click',e=>{const open=menu.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');document.getElementById('hamburger').setAttribute('aria-expanded','false')}));
const modal=document.getElementById('modal');const form=document.getElementById('quoteForm');const result=document.getElementById('messageResult');let quoteReturnFocus=null;
function openQuote(service){
 quoteReturnFocus=document.activeElement;
 modal.hidden=false;document.body.classList.add('quote-modal-open');
 form.hidden=false;result.hidden=true;
 document.getElementById('serviceSelect').value=service||'General Enquiry';
 requestAnimationFrame(()=>form.elements.name.focus());
}
function closeQuote(){
 modal.hidden=true;document.body.classList.remove('quote-modal-open');
 if(quoteReturnFocus&&quoteReturnFocus.isConnected)quoteReturnFocus.focus();
}document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>openQuote()));document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>openQuote(b.dataset.service)));document.getElementById('quoteSelected').addEventListener('click',()=>openQuote(selected.size?'Multiple Equipment Items':null));document.getElementById('closeModal').addEventListener('click',closeQuote);modal.addEventListener('click',e=>{if(e.target===modal)closeQuote()});document.addEventListener('keydown',e=>{
 if(modal.hidden)return;
 if(e.key==='Escape'){e.preventDefault();closeQuote();return}
 if(e.key!=='Tab')return;
 const focusables=[...modal.querySelectorAll('button:not([disabled]):not([hidden]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')].filter(el=>el.getClientRects().length>0&&el.closest('[hidden]')===null);
 if(!focusables.length)return;
 const first=focusables[0],last=focusables[focusables.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});let latestDraft='';
form.addEventListener('submit',e=>{
 e.preventDefault();
 const d=new FormData(form);
 const equipment=[...selected.entries()].map(([name,qty],i)=>`${i+1}. ${name} — Qty: ${qty}`).join('\n')||'No specific equipment selected; technical guidance requested.';
 latestDraft=[
 'IMRAY RESOURCES | INDUSTRIAL REQUEST FOR QUOTATION',
 'DRAFT — NOT SUBMITTED',
 '==================================================',
 'CONTACT & ORGANISATION',
 'Contact Person: '+d.get('name'),
 'Company / Facility: '+d.get('company'),
 'Industry: '+d.get('industry'),
 'Email: '+d.get('email'),
 'Phone: '+d.get('phone'),
 'Project Location: '+d.get('location'),
 'Internal Reference: '+(d.get('reference')||'Not specified'),
 '', 'PROJECT REQUIREMENTS',
 'Service: '+d.get('service'),
 'Timeline: '+d.get('timeline'),
 'Additional Details:',
 d.get('details')||'Not specified',
 '', 'EQUIPMENT REQUEST', equipment,
 '', '--------------------------------------------------',
 'This is an enquiry draft only. No pricing, availability,',
 'technical compliance or scope has been confirmed.',
 'An authorised IMRAY representative must review this request.'
 ].join('\n');
 document.getElementById('messageText').value=latestDraft;
 document.getElementById('rfqDraftRef').textContent='DRAFT / NOT SUBMITTED';
 document.getElementById('copyMessage').textContent='COPY RFQ';
 form.hidden=true;result.hidden=false;document.getElementById('copyMessage').focus();
});
document.getElementById('copyMessage').addEventListener('click',async e=>{
 try{await navigator.clipboard.writeText(latestDraft);e.currentTarget.textContent='COPIED ✓'}
 catch{const t=document.getElementById('messageText');t.focus();t.select();e.currentTarget.textContent='SELECT TEXT & COPY'}
});
document.getElementById('downloadRfq').addEventListener('click',()=>{
 const blob=new Blob([latestDraft],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='IMRAY-Industrial-RFQ-Draft.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
});
document.getElementById('editMessage').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.elements.name.focus()});
document.getElementById('year').textContent=new Date().getFullYear();

// V5.0 Interactive Corporate Registration Journey (SSM → MOF → CIDB)
const credentialRecords={
 ssm:{tab:'credTabSsm',symbol:'SSM',overline:'REGISTRATION / 01',stage:'01 / ESTABLISH BUSINESS IDENTITY',heading:'SSM Business Registration',description:'The business registration identifier is presented for IMRAY’s private concept preview. Legal particulars and current status require confirmation using official records.',reference:'NS0215205-W',extra:'Business registration · Current particulars to be verified',status:'Not independently verified'},
 mof:{tab:'credTabMof',symbol:'MOF',overline:'REGISTRATION / 02',stage:'02 / SUPPLIER REGISTRATION',heading:'Ministry of Finance Registration',description:'The supplier registration reference is presented for procurement enquiries. Active status, registered fields and relevant procurement codes must be verified before reliance.',reference:'357-0002333444',extra:'Supplier registration · Procurement codes not confirmed',status:'Not independently verified'},
 cidb:{tab:'credTabCidb',symbol:'G2',overline:'REGISTRATION / 03',stage:'03 / CONTRACTOR RECORD',heading:'CIDB Contractor Registration',description:'The contractor registration reference and G2 classification are presented for the concept preview. Current validity, work categories and contractor scope require verification.',reference:'0120190108-NS021643',extra:'G2 indicated · Categories and validity not confirmed',status:'Not independently verified'}
};
const credentialOrder=['ssm','mof','cidb'];
const credentialTabs=[...document.querySelectorAll('[data-cred]')];
let currentCredential='ssm';
function displayCredential(key,focus=false){
 const r=credentialRecords[key];if(!r)return;
 currentCredential=key;const i=credentialOrder.indexOf(key);
 const fields={credSymbol:r.symbol,credWatermark:r.symbol,credShort:key.toUpperCase(),credOverline:r.overline,credStage:r.stage,credHeading:r.heading,credDescription:r.description,credReference:r.reference,credExtra:r.extra,credStatus:r.status,journeyPosition:String(i+1).padStart(2,'0')+' / 03'};
 Object.entries(fields).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value});
 const panel=document.getElementById('credPanel');
 panel.setAttribute('aria-labelledby',r.tab);
 panel.classList.remove('journey-enter');void panel.offsetWidth;panel.classList.add('journey-enter');
 credentialTabs.forEach(t=>{const on=t.dataset.cred===key;t.classList.toggle('selected',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});
 document.getElementById('journeyProgress').style.width=((i+1)/3*100)+'%';
 document.getElementById('journeyPrev').disabled=i===0;
 document.getElementById('journeyNext').disabled=i===2;
 document.getElementById('copyCred').textContent='COPY REFERENCE ↗';
 if(focus)document.getElementById(r.tab).focus();
}
credentialTabs.forEach((t,i)=>{
 t.addEventListener('click',()=>displayCredential(t.dataset.cred));
 t.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();let next=i;
  if(e.key==='Home')next=0;else if(e.key==='End')next=2;else next=(i+(e.key==='ArrowRight'?1:2))%3;
  displayCredential(credentialOrder[next],true);
 });
});
document.getElementById('journeyPrev').addEventListener('click',()=>{const i=credentialOrder.indexOf(currentCredential);if(i>0)displayCredential(credentialOrder[i-1])});
document.getElementById('journeyNext').addEventListener('click',()=>{const i=credentialOrder.indexOf(currentCredential);if(i<2)displayCredential(credentialOrder[i+1])});
document.getElementById('copyCred').addEventListener('click',async()=>{
 const b=document.getElementById('copyCred'),value=credentialRecords[currentCredential].reference;
 try{await navigator.clipboard.writeText(value);b.textContent='COPIED ✓';setTimeout(()=>{if(b.isConnected)b.textContent='COPY REFERENCE ↗'},1600)}
 catch{const range=document.createRange();range.selectNodeContents(document.getElementById('credReference'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);b.textContent='SELECTED — PRESS CTRL+C'}
});
const docsPanel=document.getElementById('journeyDocsPanel'),docsButton=document.getElementById('journeyDocs');
docsButton.addEventListener('click',()=>{docsPanel.hidden=!docsPanel.hidden;docsButton.setAttribute('aria-expanded',String(!docsPanel.hidden));if(!docsPanel.hidden)document.getElementById('journeyDocsClose').focus()});
document.getElementById('journeyDocsClose').addEventListener('click',()=>{docsPanel.hidden=true;docsButton.setAttribute('aria-expanded','false');docsButton.focus()});
docsButton.setAttribute('aria-controls','journeyDocsPanel');docsButton.setAttribute('aria-expanded','false');
displayCredential('ssm');
// V4.9 FAQ live search and single-open accordion
(()=>{
 const input=document.getElementById('faqSearch'),count=document.getElementById('faqCount'),empty=document.getElementById('faqEmpty');
 if(!input)return;
 const entries=[...document.querySelectorAll('#faq .accordion details')];
 function filter(){
  const q=input.value.trim().toLocaleLowerCase('en');
  let shown=0;
  entries.forEach(el=>{const match=el.textContent.toLocaleLowerCase('en').includes(q);el.hidden=!match;if(!match)el.open=false;if(match)shown++});
  count.textContent=shown+' question'+(shown===1?'':'s');
  empty.hidden=shown!==0;
 }
 input.addEventListener('input',filter);
 entries.forEach(el=>el.addEventListener('toggle',()=>{if(!el.open)return;entries.forEach(other=>{if(other!==el)other.open=false})}));
 filter();
})();

// V4.9: keyboard shortcuts and enhanced UX for product selector
(()=>{
 const stage=document.getElementById('consoleProductList');
 if(!stage)return;
 stage.addEventListener('keydown',e=>{
  if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
  const buttons=[...stage.querySelectorAll('button')];if(!buttons.length)return;
  e.preventDefault();
  let i=buttons.indexOf(document.activeElement);
  if(e.key==='Home')i=0;
  else if(e.key==='End')i=buttons.length-1;
  else i=(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
  buttons[i].focus();buttons[i].click();
 });
})();

// V5.1: mobile quote shortcut appears only after the main hero leaves the viewport.
(()=>{
 const bar=document.getElementById('mobileStickyQuote');
 const hero=document.getElementById('home');
 if(!bar||!hero)return;
 const mobile=window.matchMedia('(max-width:800px)');
 const update=()=>{
  const r=hero.getBoundingClientRect();
  bar.hidden=!(mobile.matches&&r.bottom<90);
 };
 window.addEventListener('scroll',update,{passive:true});
 window.addEventListener('resize',update,{passive:true});
 update();
})();
