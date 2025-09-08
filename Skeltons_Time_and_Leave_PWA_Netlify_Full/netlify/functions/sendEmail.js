const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function escapeHtml(s){
  return String(s||'').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}
function renderHtml(type, p){
  if(type==='time'){
    return `
      <h2>Time Entry</h2>
      <p><strong>Name:</strong> ${escapeHtml(p.name)}</p>
      <p><strong>Date:</strong> ${escapeHtml(p.date)}</p>
      <p><strong>Hours:</strong> ${escapeHtml(String(p.hours))}</p>
      ${p.role?`<p><strong>Role:</strong> ${escapeHtml(p.role)}</p>`:''}
      ${p.notes?`<p><strong>Notes:</strong> ${escapeHtml(p.notes)}</p>`:''}
      <hr/><p style="color:#888">Sent from Skeltons Chemists Time App<br/>UA: ${escapeHtml(p.userAgent||'')}</p>`;
  }
  if(type==='holiday'){
    return `
      <h2>Holiday Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(p.name)}</p>
      <p><strong>Start:</strong> ${escapeHtml(p.start)}</p>
      <p><strong>End:</strong> ${escapeHtml(p.end)}</p>
      <p><strong>Type:</strong> ${escapeHtml(p.type)}</p>
      ${p.notes?`<p><strong>Notes:</strong> ${escapeHtml(p.notes)}</p>`:''}
      <hr/><p style="color:#888">Sent from Skeltons Chemists Time App<br/>UA: ${escapeHtml(p.userAgent||'')}</p>`;
  }
  return `<pre>${escapeHtml(JSON.stringify(p,null,2))}</pre>`;
}

exports.handler = async (event) => {
  try {
    if(event.httpMethod !== 'POST'){
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { type, payload } = JSON.parse(event.body || '{}');
    if(!type || !payload){
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing type or payload' }) };
    }
    const subject = type === 'time' ? `Time Entry — ${payload.name} — ${payload.date} (${payload.hours}h)`
                   : type === 'holiday' ? `Holiday Request — ${payload.name} — ${payload.start} to ${payload.end}`
                   : `Submission — ${payload.name || ''}`;

    await sgMail.send({
      to: process.env.TO_EMAIL || 'patelsa1110@gmail.com',
      from: { email: 'no-reply@skeltonschemists.app', name: 'Skeltons Chemists App' },
      subject,
      html: renderHtml(type, payload)
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
};
