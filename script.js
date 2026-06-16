// ======================= DATA =======================
const DESTINATIONS = [
  {id:1,name:'Bagasbas Beach',loc:'Daet',cat:'beach',badge:'Beach',rating:'4.9',visitors:'15K+',best:'Oct–Mar',img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',desc:'The Surfing Capital of Bicol! Powerful Pacific waves stretch along golden sands. Perfect for beginners and seasoned surfers alike. One of the Philippines\' premier surfing destinations featuring consistent surf year-round.'},
  {id:2,name:'Calaguas Island',loc:'Vinzons',cat:'beach',badge:'Island',rating:'4.9',visitors:'20K+',best:'Nov–May',img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',desc:'Home of the world-class Mahabang Buhangin — a pristine white-sand beach considered one of the most beautiful in the Philippines. Accessible only by boat, this untouched paradise is a bucket-list destination.'},
  {id:3,name:'Mercedes Siete Pecados',loc:'Mercedes',cat:'beach',badge:'Island Hopping',rating:'4.8',visitors:'10K+',best:'Jan–May',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'The Island-Hopping Capital of CamNorte! Seven stunning islands: Apuao Grande, Caringo, Quinapaguian, Malasugui, Apuao Pequeña, Canton, and Canimog — each with unique beaches, coral reefs, and marine life.'},
  {id:4,name:'Parola Island',loc:'Jose Panganiban',cat:'beach',badge:'Pink Sand',rating:'4.7',visitors:'5K+',best:'Nov–Apr',img:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',desc:'Camarines Norte\'s unique pink sand beach! A rare natural phenomenon where the sand has a rosy hue, making it one of the most Instagram-worthy and unique coastal destinations in the entire Philippines.'},
  {id:5,name:'Mt. Labo',loc:'Labo',cat:'mountain',badge:'Mountain',rating:'4.7',visitors:'6K+',best:'Dec–Apr',img:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',desc:'The highest peak in Camarines Norte. Trek through dense rainforests to reach stunning viewpoints, encounter hidden waterfalls, and experience rich biodiversity. A challenge for trekkers of all skill levels.'},
  {id:6,name:'Chai Falls',loc:'Mercedes',cat:'falls',badge:'Waterfall',rating:'4.6',visitors:'4K+',best:'All year',img:'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80',desc:'A multi-tiered forest waterfall adventure in the heart of Mercedes. Crystal-clear waters cascade through lush greenery creating one of the most scenic and refreshing natural attractions in the province.'},
  {id:7,name:'Nacali Falls',loc:'San Lorenzo Ruiz',cat:'falls',badge:'Waterfall',rating:'4.7',visitors:'3K+',best:'All year',img:'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',desc:'The majestic cascades of San Lorenzo — a breathtaking multi-tiered waterfall surrounded by towering trees and lush vegetation in one of the province\'s most pristine and untouched forested areas.'},
  {id:8,name:'Bantayog ni Rizal',loc:'Daet',cat:'heritage',badge:'Heritage',rating:'4.8',visitors:'12K+',best:'All year',img:'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',desc:'The FIRST José Rizal Monument in the Philippines — a historic landmark that predates even the Luneta monument in Manila. A proud symbol of Camarines Norte\'s deep love and reverence for the national hero.'},
  {id:9,name:'Black Nazarene Shrine',loc:'Capalonga',cat:'heritage',badge:'Religious Site',rating:'4.8',visitors:'18K+',best:'All year',img:'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=600&q=80',desc:'A major pilgrimage destination and one of the most important religious sites in the entire Bicol Region. Thousands of faithful devotees travel from across the Philippines to venerate the miraculous Black Nazarene.'},
  {id:10,name:'Maculabo Island',loc:'Paracale',cat:'beach',badge:'Island',rating:'4.6',visitors:'8K+',best:'Feb–May',img:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',desc:'A pristine island in Paracale known for its powdery white sand and crystal-clear turquoise waters. Perfect for swimming and snorkeling.'},
  {id:11,name:'Mananap Falls',loc:'San Vicente',cat:'falls',badge:'Waterfall',rating:'4.5',visitors:'5K+',best:'All year',img:'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80',desc:'A stunning 60-foot waterfall tucked inside the lush forests of San Vicente. It requires a scenic hike, rewarding visitors with a refreshing icy plunge.'},
  {id:12,name:'Mt. Cadig',loc:'Labo',cat:'mountain',badge:'Mountain',rating:'4.6',visitors:'4K+',best:'Dec–May',img:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',desc:'Known for its challenging trails and the nearby Cadig Cave. It offers a rewarding trek with panoramic views of the province and rich biodiversity.'},
  {id:13,name:'San Jose Beach',loc:'Talisay',cat:'beach',badge:'Beach',rating:'4.3',visitors:'6K+',best:'Mar–Jun',img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',desc:'A tranquil coastal stretch in Talisay, perfect for family picnics, sunset viewing, and experiencing the local fishing culture of Camarines Norte.'},
  {id:14,name:'Colasi Falls',loc:'Mercedes',cat:'falls',badge:'Waterfall',rating:'4.7',visitors:'3K+',best:'All year',img:'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',desc:'A towering 70-foot waterfall surrounded by massive rock formations. The water cascades into a deep, cool basin ideal for swimming.'}
];

const FOODS = [
  {img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',name:'Angko',loc:'Vinzons',desc:'Traditional glutinous rice cake filled with a sweet peanut mixture — chewy exterior, rich nutty filling inside.'},
  {img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',name:'Pandecillos',loc:'Vinzons',desc:'Soft baked pastry filled with crushed pili nuts or sweet creamy mixture — fluffy, nutty-sweet, and utterly delicious.'},
  {img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',name:'Sinantol',loc:'Camarines Norte',desc:'Santol fruit cooked in coconut milk with shrimp or pork — a rich balance of sour, creamy, and savory Bicolano flavors.'},
  {img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',name:'Tinumok',loc:'Camarines Norte',desc:'Taro-leaf wraps filled with coconut meat, shrimp or pork, simmered in rich coconut milk — creamy, savory, and aromatic.'},
  {img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',name:'Kinunot',loc:'Camarines Norte',desc:'Flaked shark or stingray in coconut milk with malunggay and spices — mildly spicy, creamy, a prized coastal heritage dish.'},
  {img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',name:'Tinapa of Mercedes',loc:'Mercedes',desc:'Freshly caught fish precisely smoked in local smoking houses — glistening golden skin with a deeply aromatic, savory taste.'},
  {img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',name:'Pili Tart & Roll',loc:'Daet',desc:'Crisp pastry tart and chewy cake roll filled with caramelized yema and premium native pili nuts — the perfect pasalubong.'},
];

const RESTOS = [
  {name: "Catherine's Bagasbas Lighthouse", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A beachfront favorite offering a mix of classic Filipino dishes and refreshing drinks right by the surfing waves.'},
  {name: "Aurora's Cuisine", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'Famous for serving authentic Bicolano heirloom recipes, including their signature creamy Laing and spicy Bicol Express.'},
  {name: "This Is Earl's Food & Whatnot", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A cozy, modern cafe known for its hearty comfort food, artisan burgers, and locally sourced coffee.'},
  {name: "Darex Lugawan", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'The ultimate late-night comfort spot. Renowned for their savory rice porridge (lugaw) topped with crispy pork and egg.'},
  {name: "Anita's Restaurant", loc: 'Vinzons', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A traditional eatery serving the best homemade Angko and hearty seafood meals caught fresh from the local ports.'},
  {name: "Bok's Kinalas", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'Serving the beloved Bicolano noodle soup, Kinalas. Their rich, slow-cooked broth and tender meat make it a local staple.'},
  {name: "Yudrei's Kinalas", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A hidden gem for noodle lovers, offering a uniquely spiced Kinalas broth and a very relaxed, local street-food ambiance.'},
  {name: "Lomi Hauz", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'Specializing in thick, piping hot bowls of Lomi overloaded with toppings like chicharon, meatballs, and liver.'},
  {name: "Baked by Baby", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A beloved local bakery and cafe offering fresh pastries, custom cakes, and the sweetest Pili nut desserts in town.'},
  {name: "Jannah's Pasalubong", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'Your one-stop shop for everything sweet in CamNorte! Famous for their Pili tarts and classic Bicolano snacks.'},
  {name: "Chef Tiu's Signature", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'An upscale dining experience fusing international techniques with fresh, locally sourced Bicolano ingredients.'},
  {name: "Hoogpaan Restaurant", loc: 'Bagasbas', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A vibrant surf-themed restobar. Perfect for unwinding with ice-cold drinks, grilled seafood, and live acoustic music.'},
  {name: "Alvinos Roast Grill & Fry", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'The go-to place for meat lovers, featuring perfectly roasted chicken, smoky barbecue, and deep-fried local favorites.'},
  {name: "Lugawan sa Bagasbas", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'Warm up after a morning surf session with a steaming bowl of affordable and delicious lugaw right by the beach.'},
  {name: "Tina's Eatery", loc: 'Mercedes', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'An authentic turo-turo experience offering home-cooked Sinantol and Kinunot straight from the Mercedes fish port.'},
  {name: "Jybon Chicken Inasal", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'Satisfy your cravings with perfectly grilled, authentic Chicken Inasal served with unlimited rice and savory chicken oil.'},
  {name: "Reichan Tabeya", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A unique fusion spot offering Japanese-inspired street food and sushi alongside comforting local dishes.'},
  {name: "Pan Pao (Pansit at Siopao)", loc: 'Daet', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', desc: 'A classic merienda destination famous for their massive, fluffy siopao and flavorful, freshly tossed pansit.'}
];

const FESTIVALS = [
  {month:'June',name:'Pinyasan Festival',town:'Daet',desc:'Colorful celebration of the famous sweet Formosa Pineapple of Daet, one of the most famous festivals in the province.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'June',name:'Mambulawan Festival',town:'Jose Panganiban',desc:'"Mambulawan" means gold — showcasing the rich gold mining heritage of Jose Panganiban since the Spanish era.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'August 1–8',name:'Kadagatan Festival',town:'Mercedes',desc:'"Kadagatan" means ocean — celebrating the fish industry and the people\'s deep connection to the sea.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'October 18–24',name:'Rahugan Festival',town:'Basud',desc:'Honoring St. Raphael the Archangel — "Rahugan" means group of coconuts, symbolizing unity and prosperity since 2008.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'September (1st week)',name:'Busig-on Festival',town:'Labo',desc:'Celebrating heroism, unity, peace, and Bicolano values. "Busig" means water, representing abundance in Labo.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'June 24–29',name:'Babakasin Festival',town:'Vinzons',desc:'Promoting local delicacies. Coincides with the feast of St. Peter the Apostle.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'Summer Season',name:'Mananap Festival',town:'San Vicente',desc:'Showcasing Mananap Falls and promoting eco-tourism, environmental awareness, and conservation in San Vicente.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'Annual',name:'Pabirik Festival',town:'Paracale',desc:'Celebrating gold mining heritage and honoring Our Lady of Candelaria. "Pabirik" is the traditional gold ore processing method.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'Annual',name:'Paruyan Festival',town:'Talisay',desc:'"Paruy" means rice — honoring the agricultural heritage and hard-working farmers of Talisay.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'Annual',name:'Boyoboy Festival',town:'San Lorenzo Ruiz',desc:'Promoting the pineapple industry and the role of agriculture in the community development of San Lorenzo Ruiz.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'Annual',name:'Palong Festival',town:'Capalonga',desc:'Agricultural thanksgiving combined with deep religious devotion to the Black Nazarene, the municipality\'s patron.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
  {month:'Annual',name:'Padayog Festival',town:'Santa Elena',desc:'Combines palay (rice) and niyog (coconut) — honoring farmers and coconut growers with street dancing, cultural presentations, and agricultural fairs.',img:'https://images.unsplash.com/photo-1533174000222-1d5afba26099?w=600&q=80'},
];

const MUNIS = [
  {name:'Daet',badge:'Capital City',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Surfing Capital of Bicol · First Rizal Monument · Sweet Formosa Pineapple · Cory Aquino Blvd (8.7km)'},
  {name:'Talisay',badge:'Agricultural',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'San Jose Beach · Coastal & Agricultural Landscapes · Paruyan Festival · Countryside Charm'},
  {name:'Vinzons',badge:'Heritage',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Calaguas Islands · Mt. Panit · Birthplace of W.Q. Vinzons · Angko & Pandecillos · St. Peter Apostle Church'},
  {name:'Labo',badge:'Adventure',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Mt. Labo & Mt. Cadig · Birthplace of Gen. Vicente Lukban · Waterfalls, Caves & Mountain Adventures'},
  {name:'San Vicente',badge:'Eco-Tourism',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Agricultural Heartland · Mananap Falls · Vast Rice Fields · Mananap Festival · Rural Traditions'},
  {name:'San Lorenzo Ruiz',badge:'Eco-Adventure',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Longest Zipline in Bicol · Nacali Falls · Bicol Natural Park · Untouched Forests & River Systems'},
  {name:'Mercedes',badge:'Marine',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Island-Hopping Capital · Siete Pecados Islands · Mercedes Fish Port · Tinapa, Daing, Tuyo Industry'},
  {name:'Basud',badge:'Nature',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Giant Mother Tree (Red Lauan) · Hidden Beaches · First WWII Guerrilla Stand at Laniton (Dec 18, 1941)'},
  {name:'Capalonga',badge:'Pilgrimage',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Black Nazarene Shrine · Major Pilgrimage Center of Bicol · Capalonga Lighthouse · Where Faith Meets Sea'},
  {name:'Jose Panganiban',badge:'Mining',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Pink Sands of Parola Island · Mining Heritage · Named after José Panganiban · Turayo View Deck'},
  {name:'Paracale',badge:'Gold Capital',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Gold Capital of Bicol · Pabirik Festival · Nuestra Señora de Candelaria · Centuries-Old Gold Mining'},
  {name:'Santa Elena',badge:'Agri-Tourism',img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',desc:'Northern Forests · Coconut Plantations · Agri-Tourism Haven · Rolling Countryside Landscapes'},
];

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
  return `<div class="food-card fade-in" onclick="openGenericModal('${f.name}', '${f.loc}', 'Local Delicacy', '${f.desc}', '${f.img}')">
    <img src="${f.img}" class="card-img" alt="${f.name}">
    <div class="card-body">
      <div class="food-name">${f.name}</div>
      <div class="food-loc"><i class="ti ti-map-pin" style="font-size:9px;"></i> ${f.loc}</div>
    </div>
  </div>`;
}

function renderFestCard(f){
  return `<div class="fest-card fade-in" onclick="openGenericModal('${f.name}', '${f.town}', '${f.month}', '${f.desc}', '${f.img}')">
    <img src="${f.img}" class="card-img" alt="${f.name}">
    <div class="card-body">
      <div class="fest-month">${f.month}</div>
      <div class="fest-name">${f.name}</div>
      <div class="fest-town"><i class="ti ti-map-pin" style="font-size:9px;"></i>${f.town}</div>
    </div>
  </div>`;
}

function renderRestoCard(r){
  return `<div class="resto-card fade-in" onclick="openGenericModal('${r.name}', '${r.loc}', 'Restaurant', '${r.desc.replace(/'/g, "\\'")}', '${r.img}')">
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
  if(mg) mg.innerHTML=MUNIS.map(m=>`<div class="muni-card fade-in" onclick="openGenericModal('${m.name}', 'Camarines Norte', '${m.badge}', '${m.desc}', '${m.img}')">
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