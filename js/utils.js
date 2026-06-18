// js/utils.js

// ======================= DB (localStorage) =======================
export function getDB(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveDB(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function addRecord(key, record) {
  const db = getDB(key);
  db.unshift(record);
  saveDB(key, db);
}

// ======================= AJAX SIMULATION =======================
export function ajaxPost(endpoint, data, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'data:text/plain,ok', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      setTimeout(() => {
        const txnId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        const result = { success: true, id: txnId, timestamp: new Date().toISOString(), data: data };
        if (endpoint === 'reservations') addRecord('cn_reservations', { ...data, ...result, status: 'Confirmed' });
        if (endpoint === 'tripplans') addRecord('cn_tripplans', { ...data, ...result, status: 'Pending Review' });
        if (endpoint === 'contacts') addRecord('cn_contacts', { ...data, ...result, status: 'Received' });
        cb(null, result);
      }, 1000);
    }
  };
  xhr.send();
}

// ======================= ESCAPE HELPER =======================
export function escapeQuote(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}