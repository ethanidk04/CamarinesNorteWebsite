// js/utils.js

export function escapeQuote(str) {
  if(!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Map the old fake database names to your new real PHP endpoints
const endpoints = {
  'reservations': 'api/reserve.php',
  'tripplans': 'api/plan_trip.php',
  'contacts': 'api/contact.php'
};

// Handle POST requests (Form Submissions)
export function ajaxPost(endpoint, data, cb) {
  const url = endpoints[endpoint];
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

// Handle GET requests (Retrieving Bookings)
export function ajaxGet(url, cb) {
  fetch(url)
  .then(res => res.json())
  .then(json => cb(null, json))
  .catch(err => {
    console.error('AJAX Error:', err);
    cb(err, null);
  });
}