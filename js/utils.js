export function escapeQuote(str) {
  if(!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

const endpoints = {
  'reservations': 'api/reserve.php',
  'tripplans': 'api/plan_trip.php',
  'contacts': 'api/contact.php'
};

export function ajaxPost(endpoint, data, cb) {
  // Fix: Allow direct paths (like 'api/login.php') or mapped keys
  const url = endpoint.includes('/') ? endpoint : endpoints[endpoint];
  
  if (!url) {
    console.error('Unknown endpoint:', endpoint);
    return cb(new Error('Unknown endpoint'), null);
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(json => cb(null, json))
  .catch(err => {
    console.error('AJAX Error:', err);
    cb(err, { success: false, message: 'Server error' });
  });
}

export function ajaxGet(url, cb) {
  fetch(url)
  .then(res => res.json())
  .then(json => cb(null, json))
  .catch(err => {
    console.error('AJAX Error:', err);
    cb(err, null);
  });
}