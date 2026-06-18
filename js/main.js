import { 
  initRender, filterDest, openDestModal, openGenericModal, closeModal, 
  showPage, openDrawer, closeDrawer, countUp, observeFadeIns, showMonthTip, 
  showTransport, toggleFaq, submitReservation, submitTripPlan, submitContact, 
  resetForm, loadBookings, switchBookingTab, setMinDates 
} from './ui.js';

// ======================= EVENT LISTENERS =======================
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (window.scrollY > 60) nb.classList.add('scrolled'); else nb.classList.remove('scrolled');
  const st = document.getElementById('scrollTop');
  if (window.scrollY > 300) st.classList.add('show'); else st.classList.remove('show');
});

document.addEventListener('DOMContentLoaded', () => {
  initRender();
  countUp();
  setMinDates();
  observeFadeIns();
  setTimeout(() => {
    const nb = document.getElementById('navbar');
    if (window.scrollY < 60 && !nb.classList.contains('force-solid')) nb.classList.remove('scrolled');
  }, 100);
});

// ======================= GLOBAL EXPORTS FOR HTML =======================
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