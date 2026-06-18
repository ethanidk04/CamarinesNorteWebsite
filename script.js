import { DESTINATIONS, FOODS, RESTOS, FESTIVALS, MUNIS } from './js/data.js';

// ======================= DB (localStorage) =======================
function getDB(key){try{return JSON.parse(localStorage.getItem(key)||'[]');}catch(e){return[];}}
function saveDB(key,data){localStorage.setItem(key,JSON.stringify(data));}
function addRecord(key,record){const db=getDB(key);db.unshift(record);saveDB(key,db);}

// ======================= AJAX SIMULATION =======================
function ajaxPost(endpoint,data,cb){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'data:text/plain,ok', true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      setTimeout(()=>{
        const txnId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2,5).toUpperCase();
        const result = { success: true, id: txnId, timestamp: new Date().toISOString(), data: data };
        if(endpoint==='reservations') addRecord('cn_reservations',{...data,...result,status:'Confirmed'});
        if(endpoint==='tripplans') addRecord('cn_tripplans',{...data,...result,status:'Pending Review'});
        if(endpoint==='contacts') addRecord('cn_contacts',{...data,...result,status:'Received'});
        cb(null, result);
      }, 1000);
    }
  };
  xhr.send();
}

// ======================= ESCAPE HELPER =======================
function escapeQuote(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// ======================= RENDER FUNCTIONS =======================
function renderDestCard(d,idx,showBtn=true){
  return `<div class="dest-card fade-in" data-cat="${d.cat}">
    <div class="dest-card-img">
      <img src="${d.img}" alt="${d.name}" loading="lazy">
      <div class="dest-card-num">${idx+1}</div>
      <div class="dest-card-cat">${d.badge}</div>
    </div>
    <div class="dest-card-info">
      <div class="dest-card-name">${d.name}</div>
      <div class="dest-card-loc"><i class="ti ti-map-pin"></i>${d.loc}, Camarines Norte</div>
      <div class="dest-card-rating"><span class="star">★</span><span class="rating-num">${d.rating}</span><span class="rating-count">· ${d.visitors} visitors/yr · Best: ${d.best}</span></div>
      <div class="dest-card-desc">${d.desc.substring(0,90)}...</div>
      ${showBtn?`<button class="dest-card-btn" onclick="openDestModal(${d.id-1})"><span class="btn-text-default">View Details <i class="ti ti-arrow-right"></i></span><span class="btn-text-hover">✨ Explore This!</span></button>`:''}
    </div>
  </div>`;
}

function renderFoodCard(f){
  return `<div class="food-card fade-in" onclick="openGenericModal('${escapeQuote(f.name)}', '${escapeQuote(f.loc)}', 'Local Delicacy', '${escapeQuote(f.desc)}', '${f.img}')">
    <img src="${f.img}" class="card-img" alt="${f.name}">
    <div class="card-body">
      <div class="food-name">${f.name}</div>
      <div class="food-loc"><i class="ti ti-map-pin" style="font-size:9px;"></i> ${f.loc}</div>
    </div>
  </div>`;
}

function renderFestCard(f){
  return `<div class="fest-card fade-in" onclick="openGenericModal('${escapeQuote(f.name)}', '${escapeQuote(f.town)}', '${escapeQuote(f.month)}', '${escapeQuote(f.desc)}', '${f.img}')">
    <img src="${f.img}" class="card-img" alt="${f.name}">
    <div class="card-body">
      <div class="fest-month">${f.month}</div>
      <div class="fest-name">${f.name}</div>
      <div class="fest-town"><i class="ti ti-map-pin" style="font-size:9px;"></i>${f.town}</div>
    </div>
  </div>`;
}

function renderRestoCard(r){
  return `<div class="resto-card fade-in" onclick="openGenericModal('${escapeQuote(r.name)}', '${escapeQuote(r.loc)}', 'Restaurant', '${escapeQuote(r.desc)}', '${r.img}')">
    <img src="${r.img}" class="card-img" alt="${r.name}">
    <div class="card-body">
      <div class="resto-name">${r.name}</div>
      <div style="font-size:10px; color:var(--light-gray);"><i class="ti ti-map-pin"></i> ${r.loc}</div>
    </div>
  </div>`;
}

// ======================= INITIAL RENDER =======================
function initRender(){
  // Home
  const hd=document.getElementById('home-dest-grid');
  if(hd) hd.innerHTML=DESTINATIONS.slice(0,3).map((d,i)=>renderDestCard(d,i,true)).join('');
  const hf=document.getElementById('home-food-grid');
  if(hf) hf.innerHTML=FOODS.slice(0,4).map(renderFoodCard).join('');
  const hfest=document.getElementById('home-fest-grid');
  if(hfest) hfest.innerHTML=FESTIVALS.slice(0,3).map(renderFestCard).join('');
  
  // Explore
  const ad=document.getElementById('all-dest-grid');
  if(ad) ad.innerHTML=DESTINATIONS.map((d,i)=>renderDestCard(d,i,true)).join('');
  const mg=document.getElementById('muni-grid');
  if(mg) mg.innerHTML=MUNIS.map(m=>`<div class="muni-card fade-in" onclick="openGenericModal('${escapeQuote(m.name)}', 'Camarines Norte', '${escapeQuote(m.badge)}', '${escapeQuote(m.desc)}', '${m.img}')">
    <img src="${m.img}" class="card-img" alt="${m.name}">
    <div class="card-body">
      <div class="muni-name">${m.name}</div>
      <span class="muni-badge">${m.badge}</span>
    </div>
  </div>`).join('');
  
  // Food
  const af=document.getElementById('all-food-grid');
  if(af) af.innerHTML=FOODS.map(renderFoodCard).join('');
  const rg=document.getElementById('resto-grid');
  if(rg) rg.innerHTML=RESTOS.map(renderRestoCard).join('');
  
  // Festivals
  const afest=document.getElementById('all-fest-grid');
  if(afest) afest.innerHTML=FESTIVALS.map(renderFestCard).join('');
  
  observeFadeIns();
}

// ======================= FILTER DESTINATIONS =======================
function filterDest(btn,cat){
  document.querySelectorAll('#dest-filter-row .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const cards=document.querySelectorAll('#all-dest-grid .dest-card');
  cards.forEach(c=>{c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none';});
}

// ======================= MODALS =======================
function openDestModal(idx){
  const d=DESTINATIONS[idx];
  document.getElementById('modal-content').innerHTML=`
    <div class="modal-img"><img src="${d.img}" alt="${d.name}"></div>
    <div class="modal-body">
      <div class="modal-cat">${d.badge}</div>
      <div class="modal-title">${d.name}</div>
      <div class="modal-loc"><i class="ti ti-map-pin" style="color:var(--coral);font-size:12px;"></i> ${d.loc}, Camarines Norte</div>
      <div class="modal-desc">${d.desc}</div>
      <div class="modal-stats">
        <div class="modal-stat"><div class="modal-stat-val">${d.rating} ★</div><div class="modal-stat-key">Rating</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${d.visitors}</div><div class="modal-stat-key">Visitors/yr</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${d.best}</div><div class="modal-stat-key">Best Time</div></div>
      </div>
      <button class="btn-primary" style="width:100%;" onclick="document.getElementById('destModal').classList.remove('show');showPage('reserve');">
        <i class="ti ti-calendar"></i> Book a Stay Nearby
      </button>
    </div>`;
  document.getElementById('destModal').classList.add('show');
}

function openGenericModal(title, loc, badge, desc, img) {
  document.getElementById('modal-content').innerHTML=`
    <div class="modal-img"><img src="${img}" alt="${title}"></div>
    <div class="modal-body">
      <div class="modal-cat">${badge}</div>
      <div class="modal-title">${title}</div>
      <div class="modal-loc"><i class="ti ti-map-pin" style="color:var(--coral);font-size:12px;"></i> ${loc}</div>
      <div class="modal-desc">${desc}</div>
      <button class="btn-primary" style="width:100%; margin-top:10px;" onclick="document.getElementById('destModal').classList.remove('show');showPage('plan');">
        <i class="ti ti-calendar"></i> Add to Trip Plan
      </button>
    </div>`;
  document.getElementById('destModal').classList.add('show');
}
function closeModal(e){if(e.target===document.getElementById('destModal'))document.getElementById('destModal').classList.remove('show');}

// ======================= NAVBAR =======================
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const target=document.getElementById('page-'+id);
  if(target){target.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const pages=['home','explore','food','festivals','about','plan','bookings','contact','reserve'];
  const idx=pages.indexOf(id);
  const links=document.querySelectorAll('.nav-link');
  if(idx>=0&&links[idx])links[idx].classList.add('active');

  // Force solid navbar styling on non-home pages
  const nb=document.getElementById('navbar');
  if (id !== 'home') nb.classList.add('force-solid');
  else nb.classList.remove('force-solid');

  if(id==='bookings')loadBookings();
  initRender();
  observeFadeIns();
}

// ======================= DRAWER =======================
function openDrawer(){document.getElementById('drawer').classList.add('open');document.getElementById('overlay').classList.add('show');}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('overlay').classList.remove('show');}

// ======================= SCROLL =======================
window.addEventListener('scroll',()=>{
  const nb=document.getElementById('navbar');
  if(window.scrollY>60)nb.classList.add('scrolled');else nb.classList.remove('scrolled');
  const st=document.getElementById('scrollTop');
  if(window.scrollY>300)st.classList.add('show');else st.classList.remove('show');
});

// ======================= COUNT UP =======================
function countUp(){
  document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
    const target=parseInt(el.dataset.target);
    let cur=0;const step=Math.ceil(target/25);
    const iv=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur+(target>5?'+':'');if(cur>=target)clearInterval(iv);},60);
  });
}

// ======================= FADE IN OBSERVER =======================
function observeFadeIns(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
  },{threshold:0.1});
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el=>obs.observe(el));
}

// ======================= MONTH TIP =======================
function showMonthTip(btn,month,tip){
  const t=document.getElementById('month-tip');
  t.innerHTML=`<strong>${month}:</strong> ${tip}`;
  t.classList.add('show');
  document.querySelectorAll('.month-btn').forEach(b=>b.style.fontWeight='');
  btn.style.fontWeight='800';
}

// ======================= TRANSPORT TABS =======================
function showTransport(btn,id){
  document.querySelectorAll('.transport-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.transport-content').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('transport-'+id).classList.add('active');
}

// ======================= FAQ =======================
function toggleFaq(item){item.classList.toggle('open');}

// ======================= FORMS & AJAX =======================
function submitReservation(e){
  e.preventDefault();
  const form=e.target;
  const btn=document.getElementById('reserveBtn');
  const dests=[...form.querySelectorAll('input[name="dest"]:checked')].map(c=>c.value).join(', ');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span> Processing...';
  const data={
    type:'Hotel Reservation',
    transactionId:'RES-'+Date.now(),
    firstName:form.firstName.value,lastName:form.lastName.value,
    email:form.email.value,phone:form.phone.value,
    govId:form.govId.value,
    guests:form.guests.value,nationality:form.nationality.value,
    hotel:form.hotel.value,roomType:form.roomType.value,
    checkIn:form.checkIn.value,checkOut:form.checkOut.value,
    destinations:dests,message:form.message.value,
    bookedOn:new Date().toLocaleDateString('en-PH')
  };
  ajaxPost('reservations',data,(err,res)=>{
    btn.disabled=false;btn.innerHTML='<i class="ti ti-check"></i> Confirm Reservation';
    if(res.success){
      document.getElementById('reserve-form-wrap').classList.add('hidden');
      document.getElementById('reserve-success').classList.remove('hidden');
      showToast('✅ Reservation confirmed! ID: '+res.id,'success');
    }
  });
}

function submitTripPlan(e){
  e.preventDefault();
  const form=e.target;
  const btn=document.getElementById('planBtn');
  const pdests=[...form.querySelectorAll('input[name="pdest"]:checked')].map(c=>c.value).join(', ');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span> Submitting...';
  const data={
    type:'Trip Plan',
    transactionId:'TRP-'+Date.now(),
    name:form.name.value,email:form.email.value,
    travelDate:form.travelDate.value,travelers:form.travelers.value,
    duration:form.duration.value,budget:form.budget.value,
    destinations:pdests,notes:form.notes.value,
    submittedOn:new Date().toLocaleDateString('en-PH')
  };
  ajaxPost('tripplans',data,(err,res)=>{
    btn.disabled=false;btn.innerHTML='<i class="ti ti-send"></i> Submit Trip Plan';
    if(res.success){
      document.getElementById('plan-form-wrap').classList.add('hidden');
      document.getElementById('plan-success').classList.remove('hidden');
      showToast('✅ Trip plan submitted! ID: '+res.id,'success');
    }
  });
}

function submitContact(e){
  e.preventDefault();
  const form=e.target;
  const btn=document.getElementById('contactBtn');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span> Sending...';
  const data={
    type:'Contact Message',
    transactionId:'MSG-'+Date.now(),
    name:form.name.value,email:form.email.value,
    subject:form.subject.value,message:form.message.value,
    sentOn:new Date().toLocaleDateString('en-PH')
  };
  ajaxPost('contacts',data,(err,res)=>{
    btn.disabled=false;btn.innerHTML='<i class="ti ti-send"></i> Send Message';
    if(res.success){
      document.getElementById('contact-form-wrap').classList.add('hidden');
      document.getElementById('contact-success').classList.remove('hidden');
      showToast('✅ Message sent successfully!','success');
    }
  });
}

function resetForm(formId,wrapId,successId){
  document.getElementById(formId).reset();
  document.getElementById(wrapId).classList.remove('hidden');
  document.getElementById(successId).classList.add('hidden');
}

// ======================= BOOKINGS PAGE =======================
function loadBookings(){
  renderBookingsTable('hotels-table-wrap',getDB('cn_reservations'),'reservation');
  renderBookingsTable('trips-table-wrap',getDB('cn_tripplans'),'trip');
}

function renderBookingsTable(containerId,records,type){
  const el=document.getElementById(containerId);
  if(!el)return;
  if(!records||records.length===0){
    el.innerHTML=`<div class="empty-bookings"><i class="ti ti-calendar-off"></i><div style="font-size:16px;font-weight:700;color:var(--dark);margin-bottom:4px;">No ${type==='reservation'?'Hotel Reservations':'Trip Plans'} Yet</div><p style="font-size:13px;">Your ${type==='reservation'?'hotel reservations':'trip plans'} will appear here once submitted.</p><button class="btn-primary" style="margin-top:16px;" onclick="showPage('${type==='reservation'?'reserve':'plan'}')"><i class="ti ti-plus"></i> ${type==='reservation'?'Book a Hotel':'Plan a Trip'}</button></div>`;
    return;
  }
  if(type==='reservation'){
    el.innerHTML=`<div class="bookings-table-wrap"><table class="bookings-table">
      <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Gov ID</th><th>Hotel</th><th>Room Type</th><th>Check-In</th><th>Check-Out</th><th>Guests</th><th>Status</th><th>Booked On</th></tr></thead>
      <tbody>${records.map(r=>`<tr>
        <td style="font-weight:700;color:var(--coral);">${r.transactionId||r.id}</td>
        <td>${r.firstName||''} ${r.lastName||''}</td>
        <td>${r.govId||'N/A'}</td>
        <td>${r.hotel}</td><td>${r.roomType}</td>
        <td>${r.checkIn}</td><td>${r.checkOut}</td>
        <td style="text-align:center;">${r.guests}</td>
        <td><span class="status-badge status-confirmed">${r.status}</span></td>
        <td>${r.bookedOn}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  } else {
    el.innerHTML=`<div class="bookings-table-wrap"><table class="bookings-table">
      <thead><tr><th>Plan ID</th><th>Traveler</th><th>Travel Date</th><th>Travelers</th><th>Duration</th><th>Budget</th><th>Destinations</th><th>Status</th><th>Submitted</th></tr></thead>
      <tbody>${records.map(r=>`<tr>
        <td style="font-weight:700;color:var(--coral);">${r.transactionId||r.id}</td>
        <td>${r.name}</td><td>${r.travelDate}</td>
        <td style="text-align:center;">${r.travelers}</td>
        <td>${r.duration}</td><td>${r.budget}</td>
        <td style="max-width:200px;font-size:11px;">${r.destinations||'Not specified'}</td>
        <td><span class="status-badge status-pending">${r.status}</span></td>
        <td>${r.submittedOn}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  }
}

function switchBookingTab(btn,tabId){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+tabId).classList.add('active');
}

// ======================= TOAST =======================
function showToast(msg,type=''){
  const t=document.getElementById('toast');
  t.className='toast '+(type||'');
  t.innerHTML='<i class="ti ti-check-circle"></i> '+msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

// ======================= SET MIN DATE =======================
function setMinDates(){
  const today=new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(i=>i.setAttribute('min',today));
  // Link check-in to check-out
  const checkIn=document.querySelector('input[name="checkIn"]');
  const checkOut=document.querySelector('input[name="checkOut"]');
  if(checkIn&&checkOut){
    checkIn.addEventListener('change',()=>{
      checkOut.setAttribute('min',checkIn.value);
      if(checkOut.value&&checkOut.value<=checkIn.value){checkOut.value='';}
    });
  }
}

// ======================= INIT =======================
document.addEventListener('DOMContentLoaded',()=>{
  initRender();
  countUp();
  setMinDates();
  observeFadeIns();
  setTimeout(()=>{
    const nb = document.getElementById('navbar');
    if(window.scrollY<60 && !nb.classList.contains('force-solid')) nb.classList.remove('scrolled');
  },100);
});

// ======================= GLOBAL EXPORTS FOR HTML INLINE HANDLERS =======================
window.showPage = showPage;
window.filterDest = filterDest;
window.openDestModal = openDestModal;
window.openGenericModal = openGenericModal;
window.closeModal = closeModal;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.submitReservation = submitReservation;
window.submitTripPlan = submitTripPlan;
window.submitContact = submitContact;
window.resetForm = resetForm;
window.loadBookings = loadBookings;
window.switchBookingTab = switchBookingTab;
window.showMonthTip = showMonthTip;
window.showTransport = showTransport;
window.toggleFaq = toggleFaq;