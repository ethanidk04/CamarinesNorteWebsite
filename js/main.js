import { 
  initRender, filterDest, openDestModal, openGenericModal, closeModal, 
  showPage, openDrawer, closeDrawer, countUp, observeFadeIns, showMonthTip, 
  showTransport, toggleFaq, submitReservation, submitTripPlan, submitContact, 
  resetForm, loadBookings, switchBookingTab, setMinDates, fetchLiveWeather,
  submitLogin, submitRegister, cancelBooking, checkAuthAndLockForms,
  openEditModal, submitUpdate
} from './ui.js';

// ======================= EVENT LISTENERS =======================
window.addEventListener("scroll", () => {
  const nb = document.getElementById("navbar");
  if (window.scrollY > 60) nb.classList.add("scrolled");
  else nb.classList.remove("scrolled");
  const st = document.getElementById("scrollTop");
  if (window.scrollY > 300) st.classList.add("show");
  else st.classList.remove("show");
});

document.addEventListener("DOMContentLoaded", () => {
  initRender();
  fetchLiveWeather();
  checkAuthAndLockForms();
  countUp();
  setMinDates();
  observeFadeIns();

  setTimeout(() => {
    const nb = document.getElementById("navbar");
    if (window.scrollY < 60 && !nb.classList.contains("force-solid"))
      nb.classList.remove("scrolled");
  }, 100);

  // 1. Quick Highlights - Mouse Wheel Scrolling
  const highlightsRow = document.getElementById("scrollable-highlights");
  if (highlightsRow) {
    highlightsRow.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        highlightsRow.scrollLeft += e.deltaY;
      }
    });
  }

  // 2. Home Page Background Slideshow (WITH SMOOTH FADE)
  const homeImages = [
    "Asset/Beaches/Camarines Norte.jpg",
    "Asset/Beaches/Calaguas Island.jpg",
    "Asset/Beaches/Mercedes Group of Islands.jpg",
    "Asset/Beaches/Apuao Grande.jpg",
    "Asset/Beaches/Apuao Pequena.jpg",
    "Asset/Beaches/Canimog Island.jpg",
    "Asset/Beaches/Caringo Island.jpg",
    "Asset/Beaches/Malasugui Island.jpg",
    "Asset/Beaches/Quinamanuca Island.jpg",
    "Asset/Beaches/Quinapaguian Island.jpg",
  ];

  let heroIdx = 0;
  const heroBg = document.getElementById("heroBg");
  if (heroBg) {
    heroBg.style.backgroundImage = `url('${homeImages[0]}')`;
    setInterval(() => {
      // Fade out
      heroBg.style.opacity = 0.4;

      // Wait for fade out to finish, then swap image and fade back in
      setTimeout(() => {
        heroIdx = (heroIdx + 1) % homeImages.length;
        heroBg.style.backgroundImage = `url('${homeImages[heroIdx]}')`;
        heroBg.style.opacity = 1;
      }, 400); // 400ms matches the CSS transition
    }, 4000);
  }
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
window.submitLogin = submitLogin;
window.submitRegister = submitRegister;
window.cancelBooking = cancelBooking;
window.openEditModal = openEditModal;
window.submitUpdate = submitUpdate;