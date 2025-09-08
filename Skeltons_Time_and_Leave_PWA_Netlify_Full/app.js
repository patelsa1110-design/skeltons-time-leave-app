const API_URL = '/.netlify/functions/sendEmail';
const queueKey = 'skeltons_queue_v1';
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

const timeForm = document.getElementById('timeForm');
const leaveForm = document.getElementById('leaveForm');
const queueCard = document.getElementById('queueCard');
const queueList = document.getElementById('queueList');
const retryBtn = document.getElementById('retryBtn');

function loadQueue(){ try{ return JSON.parse(localStorage.getItem(queueKey)||'[]'); }catch{ return []; } }
function saveQueue(q){ localStorage.setItem(queueKey, JSON.stringify(q)); }
function renderQueue(){ const q=loadQueue(); queueCard.hidden = q.length===0; queueList.innerHTML=q.map((i)=>`<li><strong>${i.type}</strong> — ${new Date(i.created).toLocaleString()}<br><small>${JSON.stringify(i.payload)}</small></li>`).join(''); }
async function sendPayload(type,payload){
  try{ const res = await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,payload})}); if(!res.ok) throw new Error('HTTP '+res.status); return true;}
  catch(err){ const q=loadQueue(); q.push({type,payload,created:Date.now()}); saveQueue(q); renderQueue(); return false; }
}
async function flushQueue(){ const q=loadQueue(); const remaining=[]; for(const item of q){ const ok=await sendPayload(item.type,item.payload); if(!ok) remaining.push(item);} saveQueue(remaining); renderQueue(); }
retryBtn?.addEventListener('click', flushQueue);

const todayISO = new Date().toISOString().slice(0,10);
['t_date','l_start','l_end'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=todayISO; });

if(timeForm){ timeForm.addEventListener('submit', async (e)=>{ e.preventDefault(); const data={ name:document.getElementById('t_name').value.trim(), date:document.getElementById('t_date').value, hours:parseFloat(document.getElementById('t_hours').value), role:document.getElementById('t_role').value.trim(), notes:document.getElementById('t_notes').value.trim(), userAgent:navigator.userAgent}; if(!data.name||!data.date||isNaN(data.hours)){ alert('Please complete Name, Date and Hours'); return;} const ok=await sendPayload('time',data); alert(ok?'Time submitted. Thank you!':'You are offline; saved to send later.'); e.target.reset(); document.getElementById('t_date').value=todayISO; }); }
if(leaveForm){ leaveForm.addEventListener('submit', async (e)=>{ e.preventDefault(); const data={ name:document.getElementById('l_name').value.trim(), start:document.getElementById('l_start').value, end:document.getElementById('l_end').value, type:document.getElementById('l_type').value, notes:document.getElementById('l_notes').value.trim(), userAgent:navigator.userAgent}; if(!data.name||!data.start||!data.end){ alert('Please complete Name, Start and End'); return;} const ok=await sendPayload('holiday',data); alert(ok?'Holiday request submitted.':'You are offline; saved to send later.'); e.target.reset(); document.getElementById('l_start').value=todayISO; document.getElementById('l_end').value=todayISO; }); }
window.addEventListener('online', flushQueue); renderQueue();
