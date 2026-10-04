import { DESTINATIONS, FOODS, RESTOS, FESTIVALS, MUNIS } from "./data.js";
import { ajaxPost, ajaxGet, escapeQuote } from "./utils.js";

let currentTrips = [];

// ======================= RENDER TEMPLATES =======================
export function renderDestCard(d, idx, showBtn = true) {
  const delay = (idx % 6) * 0.1; // Staggered cascading delay
  return `<div class="dest-card fade-in" data-cat="${d.cat}" style="transition-delay: ${delay}s">
    <div class="dest-card-img">
      <img src="${d.img}" alt="${d.name}" loading="lazy">
      <div class="dest-card-num">${idx + 1}</div>
      <div class="dest-card-cat">${d.badge}</div>
    </div>
    <div class="dest-card-info">
      <div class="dest-card-name">${d.name}</div>
      <div class="dest-card-loc"><i class="ti ti-map-pin"></i>${d.loc}, Camarines Norte</div>
      <div class="dest-card-rating"><span class="star">★</span><span class="rating-num">${d.rating}</span><span class="rating-count">· ${d.visitors} visitors/yr · Best: ${d.best}</span></div>
      <div class="dest-card-desc">${d.desc.substring(0, 90)}...</div>
      ${showBtn ? `<button class="dest-card-btn" onclick="openDestModal(${d.id - 1})"><span class="btn-text-default">View Details <i class="ti ti-arrow-right"></i></span><span class="btn-text-hover">✨ Explore This!</span></button>` : ""}
    </div>
  </div>`;
}

export function renderFoodCard(f, idx) {
  const delay = (idx % 4) * 0.1;
  return `<div class="food-card fade-in" style="transition-delay: ${delay}s" onclick="openGenericModal('${escapeQuote(f.name)}', '${escapeQuote(f.loc)}', 'Local Delicacy', '${escapeQuote(f.desc)}', '${f.img}')">
    <img src="${f.img}" class="card-img" alt="${f.name}">
    <div class="card-body">
      <div class="food-name">${f.name}</div>
      <div class="food-loc"><i class="ti ti-map-pin" style="font-size:9px;"></i> ${f.loc}</div>
    </div>
  </div>`;
}

export function renderFestCard(f, idx) {
  const delay = (idx % 3) * 0.1;
  return `<div class="fest-card fade-in" style="transition-delay: ${delay}s" onclick="openGenericModal('${escapeQuote(f.name)}', '${escapeQuote(f.town)}', '${escapeQuote(f.month)}', '${escapeQuote(f.desc)}', '${f.img}')">
    <img src="${f.img}" class="card-img" alt="${f.name}">
    <div class="card-body">
      <div class="fest-month">${f.month}</div>
      <div class="fest-name">${f.name}</div>
      <div class="fest-town"><i class="ti ti-map-pin" style="font-size:9px;"></i>${f.town}</div>
    </div>
  </div>`;
}

export function renderRestoCard(r, idx) {
  const delay = (idx % 3) * 0.1;
  return `<div class="resto-card fade-in" style="transition-delay: ${delay}s" onclick="openGenericModal('${escapeQuote(r.name)}', '${escapeQuote(r.loc)}', 'Restaurant', '${escapeQuote(r.desc)}', '${r.img}')">
    <img src="${r.img}" class="card-img" alt="${r.name}">
    <div class="card-body">
      <div class="resto-name">${r.name}</div>
      <div style="font-size:10px; color:var(--light-gray);"><i class="ti ti-map-pin"></i> ${r.loc}</div>
    </div>
  </div>`;
}

// ======================= INITIAL RENDER =======================
export function initRender() {
  const hd = document.getElementById("home-dest-grid");
  if (hd)
    hd.innerHTML = DESTINATIONS.slice(0, 3)
      .map((d, i) => renderDestCard(d, i, true))
      .join("");
  const hf = document.getElementById("home-food-grid");
  if (hf) hf.innerHTML = FOODS.slice(0, 4).map(renderFoodCard).join("");
  const hfest = document.getElementById("home-fest-grid");
  if (hfest)
    hfest.innerHTML = FESTIVALS.slice(0, 3).map(renderFestCard).join("");

  const ad = document.getElementById("all-dest-grid");
  if (ad)
    ad.innerHTML = DESTINATIONS.map((d, i) => renderDestCard(d, i, true)).join(
      "",
    );
  const mg = document.getElementById("muni-grid");
  if (mg)
    mg.innerHTML = MUNIS.map(
      (
        m,
        idx,
      ) => `<div class="muni-card fade-in" style="transition-delay: ${(idx % 4) * 0.1}s" onclick="openGenericModal('${escapeQuote(m.name)}', 'Camarines Norte', '${escapeQuote(m.badge)}', '${escapeQuote(m.desc)}', '${m.img}')">
    <img src="${m.img}" class="card-img" alt="${m.name}">
    <div class="card-body">
      <div class="muni-name">${m.name}</div>
      <span class="muni-badge">${m.badge}</span>
    </div>
  </div>`,
    ).join("");

  const af = document.getElementById("all-food-grid");
  if (af) af.innerHTML = FOODS.map(renderFoodCard).join("");
  const rg = document.getElementById("resto-grid");
  if (rg) rg.innerHTML = RESTOS.map(renderRestoCard).join("");

  const afest = document.getElementById("all-fest-grid");
  if (afest) afest.innerHTML = FESTIVALS.map(renderFestCard).join("");

  const spotsContainer = document.getElementById("dynamic-spots-container");
  if (spotsContainer) {
    spotsContainer.innerHTML = DESTINATIONS.map(
      (d) =>
        `<div class="spot-chip" data-name="${escapeQuote(d.name)}">${d.name}</div>`,
    ).join("");

    // Add click listener for selecting chips
    spotsContainer.querySelectorAll(".spot-chip").forEach((chip) => {
      chip.addEventListener("click", function () {
        this.classList.toggle("selected");
        // Update the hidden input with all selected values
        const selected = Array.from(
          spotsContainer.querySelectorAll(".spot-chip.selected"),
        ).map((el) => el.dataset.name);
        document.getElementById("touristSpotsInput").value =
          selected.join(", ");
        updateSpotCount();
        savePlanDraft();
      });
    });
  }

  initPlanStepper();
  observeFadeIns();
}

// ======================= TRIP PLAN STEPPER =======================
const PLAN_STEP_COUNT = 4;
let planStep = 1;

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateSpotCount() {
  const el = document.getElementById("planSpotCount");
  if (!el) return;
  const count = document.querySelectorAll(".spot-chip.selected").length;
  el.textContent = count + " selected";
}

// ======================= SEASON HINT =======================
const MONTH_SEASONS = [
  { season: "peak",     label: "Peak Season",     icon: "🌞", tip: "Excellent beach weather — ideal for island hopping & surfing." },
  { season: "peak",     label: "Peak Season",     icon: "🌞", tip: "Cool & dry — great for trekking and heritage sites." },
  { season: "peak",     label: "Peak Season",     icon: "🌞", tip: "Warm & sunny — perfect for Calaguas and Siete Pecados." },
  { season: "peak",     label: "Peak Season 🎉",  icon: "🎊", tip: "Bantayog Festival month! Book early — it fills up fast." },
  { season: "peak",     label: "Peak Season",     icon: "🌞", tip: "Late peak with fewer crowds — great for waterfalls & eco-tourism." },
  { season: "shoulder", label: "Shoulder Season", icon: "🌤", tip: "Pinyasan Festival! Some rain possible but still festive." },
  { season: "shoulder", label: "Shoulder Season", icon: "🌤", tip: "Occasional rain. Kadagatan Festival coming up in August." },
  { season: "shoulder", label: "Shoulder Season", icon: "🌤", tip: "Kadagatan Festival! Reduced hotel rates — good for cultural tourism." },
  { season: "off-peak", label: "Off-Peak Season", icon: "🌧", tip: "Busig-on Festival in Labo. Rainy season — bring rain gear." },
  { season: "off-peak", label: "Off-Peak Season", icon: "🌧", tip: "Rahugan Festival in Basud (Oct 18-24). Budget-friendly travel." },
  { season: "off-peak", label: "Off-Peak Season", icon: "🌥", tip: "Quiet charm and budget rates before the Christmas rush." },
  { season: "peak",     label: "Peak Season 🎄",  icon: "🌟", tip: "Christmas festivities begin! Great beach weather returns." },
];

function updateSeasonHint(form) {
  const hint = document.getElementById("planSeasonHint");
  const text = document.getElementById("planSeasonText");
  if (!hint || !text) return;
  const start = form.startDate.value;
  const end   = form.endDate.value;
  if (!start || !end) { hint.classList.add("hidden"); return; }
  const month = new Date(start + "T00:00:00").getMonth(); // 0-indexed
  const { season, label, icon, tip } = MONTH_SEASONS[month];
  hint.className = "season-hint season-hint--" + season;
  text.innerHTML = `<strong>${icon} ${label}</strong> — ${tip}`;
}

function buildNotesDraft(form) {
  const start = form.startDate.value;
  const end   = form.endDate.value;
  if (!start || !end) return "";
  const days = Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
  const dest = form.destination.value || "Daet";
  const templates = [
    `Day 1: Arrive in ${dest}. Check in to hotel. Explore the town and grab dinner at a local carinderia.`,
    `Day 2: Full-day island hopping or nature tour. Pack sunscreen and extra clothes.`,
    `Day 3: Visit heritage sites or waterfalls in the morning. Afternoon leisure.`,
    `Day 4: Surf session at Bagasbas Beach (or beach day). Pack up and head home.`,
    `Day 5: Optional extension — explore a nearby municipality.`,
  ];
  return Array.from({ length: days }, (_, i) => templates[i] || `Day ${i + 1}: ` ).join("\n");
}

function initPlanStepper() {
  const form = document.getElementById("planForm");
  if (!form) return;

  // Enter moves to the next step instead of submitting a half-filled form
  form.addEventListener("keydown", (e) => {
    const tag = e.target.tagName;
    if (
      e.key === "Enter" &&
      tag !== "TEXTAREA" &&
      tag !== "BUTTON" &&
      planStep < PLAN_STEP_COUNT
    ) {
      e.preventDefault();
      planNext();
    }
  });

  // End date can't be earlier than the start date
  form.startDate.addEventListener("change", () => {
    form.endDate.setAttribute("min", form.startDate.value);
    updateSeasonHint(form);
    prefillNotes(form);
  });
  form.endDate.addEventListener("change", () => {
    updateSeasonHint(form);
    prefillNotes(form);
  });
  form.destination.addEventListener("change", () => {
    prefillNotes(form);
  });

  // Keep the draft in the browser so nothing is lost on reload or login
  form.addEventListener("input", savePlanDraft);
  form.addEventListener("change", savePlanDraft);

  const draft = readPlanDraft();
  if (draft) applyPlanDraft(draft);
}

function prefillNotes(form) {
  // Only pre-fill if the notes field is empty or still contains the old auto-draft
  const notes = form.notes;
  const draft = buildNotesDraft(form);
  if (draft && (!notes.value.trim() || notes.dataset.autofilled === "1")) {
    notes.value = draft;
    notes.dataset.autofilled = "1";
    savePlanDraft();
  }
}

// ======================= TRIP PLAN DRAFT (localStorage) =======================
const PLAN_DRAFT_KEY = "cnTripDraft";
const PLAN_FIELDS = [
  "tripName",
  "destination",
  "travelers",
  "startDate",
  "endDate",
  "touristSpots",
  "transportMode",
  "budget",
  "notes",
];
const PLAN_SAVE_LABEL = '<i class="ti ti-device-floppy"></i> Save to My Itinerary';

function readPlanDraft() {
  try {
    return JSON.parse(localStorage.getItem(PLAN_DRAFT_KEY));
  } catch {
    return null;
  }
}

function savePlanDraft() {
  const form = document.getElementById("planForm");
  // Editing a saved itinerary is not a draft
  if (!form || form.planId.value) return updatePlanDraftNote();

  const fields = {};
  PLAN_FIELDS.forEach((name) => (fields[name] = form[name].value));

  // Transport and budget always have a default, so they don't count as "started"
  const started = PLAN_FIELDS.some(
    (name) => name !== "transportMode" && name !== "budget" && fields[name],
  );

  try {
    if (started) {
      localStorage.setItem(
        PLAN_DRAFT_KEY,
        JSON.stringify({ fields, step: planStep }),
      );
    } else {
      localStorage.removeItem(PLAN_DRAFT_KEY);
    }
  } catch {}
  updatePlanDraftNote();
}

function applyPlanDraft(draft) {
  const form = document.getElementById("planForm");
  PLAN_FIELDS.forEach((name) => {
    if (draft.fields && draft.fields[name] != null) {
      form[name].value = draft.fields[name];
    }
  });

  const selectedSpots = form.touristSpots.value
    ? form.touristSpots.value.split(", ")
    : [];
  document.querySelectorAll(".spot-chip").forEach((chip) => {
    chip.classList.toggle("selected", selectedSpots.includes(chip.dataset.name));
  });
  updateSpotCount();
  goToPlanStep(draft.step || 1, false);
}

function updatePlanDraftNote() {
  const form = document.getElementById("planForm");
  const note = document.getElementById("planDraftNote");
  if (!form || !note) return;

  const editing = !!form.planId.value;
  const hasDraft = !!readPlanDraft();
  note.classList.toggle("hidden", !editing && !hasDraft);
  document.getElementById("planDraftText").textContent = editing
    ? "Editing a saved itinerary."
    : "Draft saved on this device.";
  document.getElementById("planDraftBtn").textContent = editing
    ? "Cancel edit"
    : "Start over";
}

// Empties the form. If we were editing a saved itinerary, the unsaved draft comes back.
function clearPlanForm() {
  const form = document.getElementById("planForm");
  const draft = form.planId.value ? readPlanDraft() : null;

  form.reset();
  form.planId.value = "";
  document
    .querySelectorAll(".spot-chip")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("touristSpotsInput").value = "";
  updateSpotCount();
  document.getElementById("planBtn").innerHTML = PLAN_SAVE_LABEL;
  goToPlanStep(1, false);

  if (draft) applyPlanDraft(draft);
}

export function startOverPlan() {
  clearPlanForm();
}

// Returns the first field in a step that fails validation, or null if the step is OK
function firstInvalidPlanField(step) {
  const form = document.getElementById("planForm");
  const panel = form.querySelector(`.plan-panel[data-step="${step}"]`);

  if (step === 1) {
    const start = form.startDate.value;
    const end = form.endDate.value;
    form.endDate.setCustomValidity(
      start && end && end < start
        ? "End date can't be before the start date."
        : "",
    );
  }

  return (
    [...panel.querySelectorAll("input, select, textarea")].find(
      (f) => !f.checkValidity(),
    ) || null
  );
}

// interactive = false: a silent jump (restore/reset) with no scrolling or error bubbles
export function goToPlanStep(target, interactive = true) {
  const form = document.getElementById("planForm");
  if (!form) return;

  // Every step before the target must be valid; otherwise stop at the first bad one
  let invalid = null;
  for (let s = 1; s < target && !invalid; s++) {
    invalid = firstInvalidPlanField(s);
    if (invalid) target = s;
  }
  planStep = target;

  form.querySelectorAll(".plan-panel").forEach((p) => {
    p.classList.toggle("active", Number(p.dataset.step) === planStep);
  });
  form.querySelectorAll(".plan-steps li").forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle("active", n === planStep);
    li.classList.toggle("done", n < planStep);
  });

  const isLast = planStep === PLAN_STEP_COUNT;
  document.getElementById("planBackBtn").classList.toggle("hidden", planStep === 1);
  document.getElementById("planNextBtn").classList.toggle("hidden", isLast);
  document.getElementById("planBtn").classList.toggle("hidden", !isLast);

  if (isLast) renderPlanReview();

  // Keep the top of the form in view when the step height changes
  const card = form.closest(".form-card");
  const top = card.getBoundingClientRect().top;
  if (interactive && top < 0) {
    window.scrollTo({ top: top + window.scrollY - 100, behavior: "smooth" });
  }

  if (invalid && interactive) invalid.reportValidity();
  savePlanDraft();
}

export function planNext() {
  goToPlanStep(planStep + 1);
}

export function planBack() {
  goToPlanStep(planStep - 1);
}

function renderPlanReview() {
  const form = document.getElementById("planForm");
  const fmtDate = (v) =>
    new Date(v + "T00:00:00").toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const start = form.startDate.value;
  const end = form.endDate.value;
  const days =
    Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
  const spots = form.touristSpots.value
    ? form.touristSpots.value.split(", ")
    : [];

  const row = (label, value) =>
    `<div class="plan-review-row"><span class="plan-review-label">${label}</span><span class="plan-review-value">${value}</span></div>`;
  const block = (title, step, body) =>
    `<div class="plan-review-block">
      <div class="plan-review-head">
        <div class="plan-review-title">${title}</div>
        <button type="button" class="plan-review-edit" onclick="goToPlanStep(${step})"><i class="ti ti-edit"></i> Edit</button>
      </div>
      ${body}
    </div>`;

  document.getElementById("planReview").innerHTML =
    block(
      "Basics",
      1,
      row("Trip name", escapeHtml(form.tripName.value)) +
        row("Destination", escapeHtml(form.destination.value)) +
        row(
          "Dates",
          `${fmtDate(start)} to ${fmtDate(end)} (${days} ${days === 1 ? "day" : "days"})`,
        ) +
        row("Travelers", escapeHtml(form.travelers.value) + " Pax"),
    ) +
    block(
      "Attractions",
      2,
      spots.length
        ? `<div class="plan-review-chips">${spots.map((s) => `<span class="spot-chip selected">${escapeHtml(s)}</span>`).join("")}</div>`
        : `<div class="plan-review-empty">None selected yet.</div>`,
    ) +
    block(
      "Details",
      3,
      row("Transport", escapeHtml(form.transportMode.value)) +
        row("Budget", escapeHtml(form.budget.value)) +
        row(
          "Notes",
          form.notes.value.trim()
            ? escapeHtml(form.notes.value)
            : `<span class="plan-review-empty">No notes yet.</span>`,
        ),
    );
}

// ======================= UI INTERACTIONS =======================
export function filterDest(btn, cat) {
  document
    .querySelectorAll("#dest-filter-row .filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const cards = document.querySelectorAll("#all-dest-grid .dest-card");
  cards.forEach((c) => {
    c.style.display = cat === "all" || c.dataset.cat === cat ? "" : "none";
    c.classList.remove("visible"); // Force re-animation when filtering!
  });
  setTimeout(() => observeFadeIns(), 50);
}

export function openDestModal(idx) {
  const d = DESTINATIONS[idx];
  document.getElementById("modal-content").innerHTML = `
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
  document.getElementById("destModal").classList.add("show");
}

export function openGenericModal(title, loc, badge, desc, img) {
  document.getElementById("modal-content").innerHTML = `
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
  document.getElementById("destModal").classList.add("show");
}

export function closeModal(e) {
  if (e.target === document.getElementById("destModal"))
    document.getElementById("destModal").classList.remove("show");
}

export function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const target = document.getElementById("page-" + id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));
  const pages = [
    "home",
    "explore",
    "food",
    "festivals",
    "about",
    "plan",
    "bookings",
    "contact",
  ];
  const idx = pages.indexOf(id);
  const links = document.querySelectorAll(".nav-link");
  if (idx >= 0 && links[idx]) links[idx].classList.add("active");

  const nb = document.getElementById("navbar");

  if (id !== "home" && id !== "about") {
    nb.classList.add("force-solid");
  } else {
    nb.classList.remove("force-solid");
  }

  // FIX: This tells the database to fetch data if we visit Bookings OR the Plan page
  if (id === "bookings" || id === "plan") loadBookings();

  // Reset all animation classes so they run again when switching tabs!
  document
    .querySelectorAll(".fade-in, .slide-left, .slide-right, .zoom-in")
    .forEach((el) => {
      el.classList.remove("visible");
    });

  initRender();
  setTimeout(() => observeFadeIns(), 50);
}

export function openDrawer() {
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
export function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

export function countUp() {
  document.querySelectorAll(".stat-num[data-target]").forEach((el) => {
    const target = parseInt(el.dataset.target);
    let cur = 0;
    const step = Math.ceil(target / 25);
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + (target > 5 ? "+" : "");
      if (cur >= target) clearInterval(iv);
    }, 60);
  });
}

// THIS OBSERVES ALL ANIMATION CLASSES
export function observeFadeIns() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // Play animation when entering the screen
          e.target.classList.add("visible");
        } else {
          // Reset animation when leaving the screen
          e.target.classList.remove("visible");

          // Detect which way the element went off-screen
          if (e.boundingClientRect.top < 0) {
            // Element went off the top of the screen (user scrolled down)
            e.target.classList.add("from-top");
          } else {
            // Element went off the bottom of the screen (user scrolled up)
            e.target.classList.remove("from-top");
          }
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".fade-in, .slide-left, .slide-right, .zoom-in")
    .forEach((el) => obs.observe(el));
}

export function showMonthTip(btn, month, tip) {
  const t = document.getElementById("month-tip");
  const allBtns = Array.from(document.querySelectorAll(".month-btn"));
  const index = allBtns.indexOf(btn);
  const isActive = btn.classList.contains("active");

  // Reset all
  document
    .querySelectorAll(".month-btn")
    .forEach((b) => b.classList.remove("active"));
  t.classList.remove("show", "overlap-mode", "stretch-mode");

  if (isActive) return;

  t.innerHTML = tip;

  const mode = index < 6 ? "overlap-mode" : "stretch-mode";
  t.classList.add(mode);

  btn.appendChild(t);
  btn.classList.add("active");

  setTimeout(() => t.classList.add("show"), 10);
}

export function showTransport(btn, id) {
  document
    .querySelectorAll(".transport-tab")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".transport-content")
    .forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("transport-" + id).classList.add("active");
}

export function toggleFaq(item) {
  item.classList.toggle("open");
}

// ======================= FORMS & SUBMISSIONS =======================
export function submitReservation(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("reserveBtn");
  const dests = [...form.querySelectorAll('input[name="dest"]:checked')]
    .map((c) => c.value)
    .join(", ");

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Processing...';

  const data = {
    transactionId: "RES-" + Date.now(),
    // REMOVED personal info (firstName, email, phone, etc.) - Backend handles via user_id
    hotel: form.hotel.value,
    roomType: form.roomType.value,
    checkIn: form.checkIn.value,
    checkOut: form.checkOut.value,
    guests: form.guests.value,
    destinations: dests,
    message: form.message.value,
    bookedOn: new Date().toLocaleDateString("en-PH"),
  };

  ajaxPost("reservations", data, (err, res) => {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-check"></i> Confirm Reservation';
    if (res && res.success) {
      document.getElementById("reserve-form-wrap").classList.add("hidden");
      document.getElementById("reserve-success").classList.remove("hidden");
      showToast("Reservation confirmed! ID: " + res.id, "success");
    } else {
      showToast(res ? res.message : "Error submitting reservation", "error");
    }
  });
}

export function submitTripPlan(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("planBtn");
  const spots = form.touristSpots.value;

  // The form is novalidate (hidden steps can't show browser errors), so re-check every step here
  goToPlanStep(PLAN_STEP_COUNT);
  if (planStep !== PLAN_STEP_COUNT) return;

  // Anyone can draft a trip; an account is only needed to save it
  if (!isLoggedIn) {
    pendingPlanSave = true;
    openAuthModal();
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving...';

  // Check if we are updating an existing plan
  const planId = form.planId ? form.planId.value : "";

  const data = {
    id: planId,
    target: "trip", // Tells update_entry.php this is a trip plan
    transactionId: planId ? undefined : "TRP-" + Date.now(),
    tripName: form.tripName.value,
    startDate: form.startDate.value,
    endDate: form.endDate.value,
    travelers: form.travelers.value,
    destination: form.destination.value,
    touristSpots: spots,
    transportMode: form.transportMode.value,
    budget: form.budget.value,
    notes: form.notes.value,
    submittedOn: new Date().toLocaleDateString("en-PH"),
  };

  // Route to the correct PHP file depending on if we are creating or updating
  const endpoint = planId ? "api/update_entry.php" : "tripplans";

  ajaxPost(endpoint, data, (err, res) => {
    btn.disabled = false;
    btn.innerHTML = planId
      ? '<i class="ti ti-device-floppy"></i> Update Itinerary'
      : PLAN_SAVE_LABEL;

    if (res && res.success) {
      if (planId) {
        showToast("Itinerary updated successfully!", "success");
      } else {
        document.getElementById("plan-form-wrap").classList.add("hidden");
        document.getElementById("plan-success").classList.remove("hidden");
      }

      // Reset form, chips and the saved draft
      clearPlanForm();

      loadBookings(); // Refresh the table
    } else {
      showToast(res ? res.message : "Error saving itinerary", "error");
    }
  });
}

export function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("contactBtn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Sending...';
  const data = {
    type: "Contact Message",
    transactionId: "MSG-" + Date.now(),
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
    sentOn: new Date().toLocaleDateString("en-PH"),
  };
  ajaxPost("contacts", data, (err, res) => {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-send"></i> Send Message';
    if (res.success) {
      document.getElementById("contact-form-wrap").classList.add("hidden");
      document.getElementById("contact-success").classList.remove("hidden");
      showToast("✅ Message sent successfully!", "success");
    }
  });
}

export function resetForm(formId, wrapId, successId) {
  document.getElementById(formId).reset();
  document.getElementById(wrapId).classList.remove("hidden");
  document.getElementById(successId).classList.add("hidden");
  if (formId === "planForm") goToPlanStep(1, false);
}

export function loadBookings() {
  const hotelsWrap = document.getElementById("hotels-table-wrap");
  const tripsWrap = document.getElementById("trips-table-wrap");

  if (hotelsWrap)
    hotelsWrap.innerHTML =
      '<div style="padding: 20px; text-align: center;"><span class="spinner"></span> Loading database records...</div>';
  if (tripsWrap)
    tripsWrap.innerHTML =
      '<div style="padding: 20px; text-align: center;"><span class="spinner"></span> Loading database records...</div>';

  ajaxGet("api/get_bookings.php", (err, data) => {
    if (err) {
      console.error(err);
      showToast("Error loading bookings from database.", "error");
      return;
    }

    // Save trips globally so we can edit them
    currentTrips = data.tripplans || [];

    renderBookingsTable("hotels-table-wrap", data.reservations, "reservation");
    renderBookingsTable("trips-table-wrap", currentTrips, "trip");
  });
}

export function renderBookingsTable(containerId, records, type) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!records || records.length === 0 || records.success === false) {
    el.innerHTML = `<div class="empty-bookings" style="text-align:center; padding: 40px 20px;">
      <i class="ti ${type === "reservation" ? "ti-calendar-off" : "ti-map-off"}" style="font-size: 48px; color: var(--light-gray); margin-bottom: 16px;"></i>
      <div style="font-size:16px;font-weight:700;color:var(--dark);margin-bottom:4px;">No ${type === "reservation" ? "Hotel Reservations" : "Saved Itineraries"} Found</div>
      <p style="font-size:13px; color: var(--gray);">Please log in or create one to view records.</p>
    </div>`;
    return;
  }

  if (type === "reservation") {
    el.innerHTML = `<div class="bookings-table-wrap"><table class="bookings-table">
      <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Hotel</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${records
        .map(
          (r) => `<tr>
        <td style="font-weight:700;color:var(--coral);">${r.transactionId}</td>
        <td>${r.firstName} ${r.lastName}</td>
        <td>${r.hotel}</td><td>${r.checkIn}</td><td>${r.checkOut}</td>
        <td><span class="status-badge status-confirmed">${r.status || "Confirmed"}</span></td>
        <td>
          <button class="filter-btn active" style="padding:4px 10px; font-size:11px; margin-right:4px;" onclick="openEditModal(${r.id}, 'reservation', '${r.checkIn}', '${r.checkOut}', '${r.guests}')"><i class="ti ti-edit"></i> Edit</button>
          <button class="filter-btn" style="padding:4px 10px; font-size:11px;" onclick="cancelBooking(${r.id}, 'reservation')"><i class="ti ti-trash"></i> Delete</button>
        </td>
      </tr>`,
        )
        .join("")}</tbody>
    </table></div>`;
  } else {
    el.innerHTML = `<div class="bookings-table-wrap"><table class="bookings-table">
      <thead><tr><th>Plan ID</th><th>Trip Name</th><th>Dates</th><th>Travelers</th><th>Actions</th></tr></thead>
      <tbody>${records
        .map(
          (r) => `<tr>
        <td style="font-weight:700;color:var(--coral);">${r.transactionId}</td>
        <td><strong>${r.tripName}</strong></td>
        <td>${r.startDate} to ${r.endDate}</td>
        <td>${r.travelers} Pax</td>
        <td>
          <!-- NEW: Calls editTripPlan instead of the modal -->
          <button class="filter-btn active" style="padding:4px 10px; font-size:11px; margin-right:4px;" onclick="editTripPlan(${r.id})"><i class="ti ti-edit"></i> Edit Itinerary</button>
          <button class="filter-btn" style="padding:4px 10px; font-size:11px;" onclick="cancelBooking(${r.id}, 'trip')"><i class="ti ti-trash"></i> Delete Plan</button>
        </td>
      </tr>`,
        )
        .join("")}</tbody>
    </table></div>`;
  }
}

export function editTripPlan(id) {
  // Use == instead of === in case the database returns the ID as a string
  const trip = currentTrips.find((t) => t.id == id);
  if (!trip) return;

  // FIX: Force the form to become visible again (hides the success screen if it was open)
  document.getElementById("plan-form-wrap").classList.remove("hidden");
  document.getElementById("plan-success").classList.add("hidden");

  const form = document.getElementById("planForm");

  // Populate standard fields
  form.planId.value = trip.id;
  form.tripName.value = trip.tripName;
  form.destination.value = trip.destination;
  form.transportMode.value = trip.transportMode;
  form.startDate.value = trip.startDate;
  form.endDate.value = trip.endDate;
  form.travelers.value = trip.travelers;
  form.budget.value = trip.budget;
  form.notes.value = trip.notes;

  // Populate the dynamic chips
  const selectedSpots = trip.touristSpots ? trip.touristSpots.split(", ") : [];
  document.getElementById("touristSpotsInput").value = trip.touristSpots || "";

  document.querySelectorAll(".spot-chip").forEach((chip) => {
    if (selectedSpots.includes(chip.dataset.name)) {
      chip.classList.add("selected");
    } else {
      chip.classList.remove("selected");
    }
  });
  updateSpotCount();
  goToPlanStep(1, false);

  // Change button text to reflect an update
  const btn = document.getElementById("planBtn");
  btn.innerHTML = '<i class="ti ti-device-floppy"></i> Update Itinerary';

  // Smooth scroll back up to the form
  const formWrap = document.getElementById("plan-form-wrap");

  // Calculate exact position accounting for current scroll and the fixed navbar
  const exactPosition =
    formWrap.getBoundingClientRect().top + window.scrollY - 120;

  window.scrollTo({ top: exactPosition, behavior: "smooth" });
}

export function switchBookingTab(btn, tabId) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("tab-" + tabId).classList.add("active");
}

export function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.className = "toast " + (type || "");
  t.innerHTML = '<i class="ti ti-check-circle"></i> ' + msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

export function setMinDates() {
  const today = new Date().toISOString().split("T")[0];
  document
    .querySelectorAll('input[type="date"]')
    .forEach((i) => i.setAttribute("min", today));
  const checkIn = document.querySelector('input[name="checkIn"]');
  const checkOut = document.querySelector('input[name="checkOut"]');
  if (checkIn && checkOut) {
    checkIn.addEventListener("change", () => {
      checkOut.setAttribute("min", checkIn.value);
      if (checkOut.value && checkOut.value <= checkIn.value) {
        checkOut.value = "";
      }
    });
  }
}

export function fetchLiveWeather() {
  const weatherEl = document.getElementById("live-weather");
  if (!weatherEl) return;

  // Coordinates for Daet, Camarines Norte
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=14.1106&longitude=122.9553&current_weather=true";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;
      const isDay = data.current_weather.is_day;

      let condition = "Clear";
      let icon = isDay ? "ti-sun" : "ti-moon";
      let color = isDay ? "#F6AD55" : "#CBD5E0"; // Orange for sun, grayish for moon

      // Basic WMO Weather Code translation to your Tabler Icons
      if (code > 0 && code <= 3) {
        condition = "Cloudy";
        icon = "ti-cloud";
        color = "#E2E8F0";
      } else if (code >= 51 && code <= 67) {
        condition = "Rain";
        icon = "ti-cloud-rain";
        color = "#63B3ED";
      } else if (code >= 80 && code <= 82) {
        condition = "Showers";
        icon = "ti-cloud-rain";
        color = "#63B3ED";
      } else if (code >= 95) {
        condition = "Storm";
        icon = "ti-cloud-storm";
        color = "#718096";
      }

      weatherEl.innerHTML = `<i class="ti ${icon}" style="color:${color}; font-size:16px;"></i> ${temp}°C ${condition} &nbsp; &nbsp; Daet, Camarines Norte`;
    })
    .catch((err) => {
      console.error("Weather fetch error:", err);
      // Fallback if the API fails
      weatherEl.innerHTML = `<i class="ti ti-cloud" style="color:#A0AEC0;"></i> Weather Unavailable &nbsp; &nbsp; Daet, Camarines Norte`;
    });
}

export function submitLogin(e) {
  e.preventDefault();
  const data = {
    email: e.target.email.value,
    password: e.target.password.value,
  };
  ajaxPost("api/login.php", data, (err, res) => {
    if (res && res.success) {
      onLoginSuccess();
    } else {
      showToast(res ? res.message : "Login failed", "error");
    }
  });
}

function onLoginSuccess() {
  showToast("Logged in successfully!", "success");

  // Logged in from the Save popup: stay on the page and finish saving the trip
  if (pendingPlanSave) {
    closeAuthModal();
    applyAuthState(true);
    document.getElementById("planForm").requestSubmit();
    return;
  }

  // Refresh the page so the forms unlock!
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function openAuthModal() {
  const body = document.getElementById("authModalBody");

  // First use: copy the Account page forms so there is only one version to maintain
  if (!body.firstChild) {
    const card = document.querySelector("#page-auth .form-card").cloneNode(true);
    card.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    body.append(...card.children);
  }
  document.getElementById("authModal").classList.add("show");
}

export function closeAuthModal() {
  pendingPlanSave = false;
  document.getElementById("authModal").classList.remove("show");
}

// Switches between the Login and Register views (Account page and popup)
export function toggleAuthView(el) {
  el.closest(".auth-view")
    .parentElement.querySelectorAll(".auth-view")
    .forEach((v) => v.classList.toggle("hidden"));
}

// ======================= REGISTER FIELD ERRORS =======================
function clearRegErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
    el.classList.remove("visible");
  });
  document.querySelectorAll(".form-input.invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
}

function showRegFieldError(fieldName, message) {
  const errEl = document.getElementById("reg-err-" + fieldName);
  const form = document.getElementById("registerForm");
  const input = form ? form[fieldName] : null;
  if (errEl) { errEl.textContent = message; errEl.classList.add("visible"); }
  if (input) input.classList.add("invalid");
}

export function togglePassVisibility(btn) {
  const input = btn.closest(".input-with-toggle").querySelector("input");
  const icon = btn.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "ti ti-eye-off";
    btn.setAttribute("aria-label", "Hide password");
  } else {
    input.type = "password";
    icon.className = "ti ti-eye";
    btn.setAttribute("aria-label", "Show password");
  }
}

export function submitRegister(e) {
  e.preventDefault();
  clearRegErrors();
  const form = e.target;

  // Client-side validation
  let hasError = false;
  if (!form.firstName.value.trim()) { showRegFieldError("firstName", "First name is required."); hasError = true; }
  if (!form.lastName.value.trim())  { showRegFieldError("lastName",  "Last name is required.");  hasError = true; }
  if (!form.email.value.trim())     { showRegFieldError("email",     "Email is required.");      hasError = true; }
  if (!form.password.value)         { showRegFieldError("password",  "Password is required.");   hasError = true; }
  else if (form.password.value.length < 8) { showRegFieldError("password", "Password must be at least 8 characters."); hasError = true; }
  if (!form.phone.value.trim())     { showRegFieldError("phone",     "Phone number is required."); hasError = true; }
  if (!form.govId.value.trim())     { showRegFieldError("govId",     "Gov ID / Passport is required."); hasError = true; }
  if (hasError) return;

  const data = {
    firstName:   form.firstName.value,
    lastName:    form.lastName.value,
    email:       form.email.value,
    password:    form.password.value,
    phone:       form.phone.value,
    govId:       form.govId.value,
    nationality: form.nationality.value || "Filipino",
  };

  ajaxPost("api/register.php", data, (err, res) => {
    if (res && res.success) {
      // Log the new user straight in so they don't have to type it all again
      const creds = { email: data.email, password: data.password };
      form.reset();
      clearRegErrors();
      ajaxPost("api/login.php", creds, (err, loginRes) => {
        if (loginRes && loginRes.success) {
          onLoginSuccess();
        } else {
          showToast("Account created! Please log in.", "success");
          toggleAuthView(form);
        }
      });
    } else {
      // Show the server error under the email field (most common: duplicate email)
      showRegFieldError("email", res ? res.message : "Registration failed. Please try again.");
    }
  });
}

export function cancelBooking(id, targetType) {
  if (!confirm(`Are you sure you want to cancel this ${targetType}?`)) return;

  ajaxPost(
    "api/delete_entry.php",
    { id: id, target: targetType },
    (err, res) => {
      if (res && res.success) {
        showToast("Canceled successfully!", "success");
        loadBookings(); // Refresh the table to remove the deleted row
      } else {
        showToast(res ? res.message : "Failed to cancel", "error");
      }
    },
  );
}

let isLoggedIn = false;
let pendingPlanSave = false; // true while the Save popup is waiting for a login

export function checkAuthAndLockForms() {
  ajaxGet("api/check_session.php", (err, res) => {
    applyAuthState(!!(res && res.loggedIn));
  });
}

function applyAuthState(loggedIn) {
  isLoggedIn = loggedIn;
  const resWrap = document.getElementById("reserve-form-wrap");
  const lock = document.getElementById("reserve-lock");

  if (loggedIn) {
    // Change the "Account" buttons to say "Logout"
    document.querySelectorAll(".nav-link, .drawer-link").forEach((btn) => {
      if (btn.textContent.includes("Account")) {
        btn.innerHTML = btn.innerHTML.replace("Account", "Logout");
        btn.onclick = () => {
          fetch("api/logout.php").then(() => window.location.reload());
        };
      }
    });

    // Unlock the Hotel Booking Form (when logging in without a page reload)
    if (lock) {
      lock.remove();
      resWrap.classList.remove("hidden");
    }

    // FIX: Pre-load the user's data in the background immediately!
    loadBookings();
  } else {
    // Lock the Hotel Booking Form (hidden, not removed, so it can be unlocked later)
    if (resWrap && !lock) {
      resWrap.classList.add("hidden");
      resWrap.insertAdjacentHTML(
        "beforebegin",
        `<div id="reserve-lock" style="text-align:center; padding: 60px 20px; background: #fff; border-radius: 12px; box-shadow: var(--shadow);">
              <i class="ti ti-lock" style="font-size: 48px; color: var(--light-gray); margin-bottom: 16px; display:inline-block;"></i>
              <h3 style="margin-bottom: 8px;">Authentication Required</h3>
              <p style="color:var(--gray); margin-bottom: 24px;">You must be logged in to your account to book a hotel reservation.</p>
              <button class="btn-primary" onclick="showPage('auth')">Go to Login</button>
            </div>`,
      );
    }

    // The Trip Plan Form stays open: anyone can draft, login is asked for at Save
    renderBookingsTable("trips-table-wrap", [], "trip");
  }
}

export function openEditModal(id, target, val1, val2, val3) {
  document.getElementById("editId").value = id;
  document.getElementById("editTarget").value = target;

  const fields = document.getElementById("editFields");

  if (target === "reservation") {
    fields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">Check-In Date</label>
        <input class="form-input" type="date" name="checkIn" value="${val1}" required>
      </div>
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">Check-Out Date</label>
        <input class="form-input" type="date" name="checkOut" value="${val2}" required>
      </div>
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">Number of Guests</label>
        <input class="form-input" type="number" name="guests" value="${val3}" min="1" required>
      </div>`;
  } else {
    // UPDATED for Trip Plan dates
    fields.innerHTML = `
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">Start Date</label>
        <input class="form-input" type="date" name="startDate" value="${val1}" required>
      </div>
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">End Date</label>
        <input class="form-input" type="date" name="endDate" value="${val2}" required>
      </div>
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">Number of Travelers</label>
        <input class="form-input" type="number" name="travelers" value="${val3}" min="1" required>
      </div>`;
  }

  document.getElementById("editModal").classList.add("show");
}

export function submitUpdate(e) {
  e.preventDefault();
  const target = document.getElementById("editTarget").value;

  let data = {
    id: document.getElementById("editId").value,
    target: target,
  };

  if (target === "reservation") {
    data.checkIn = e.target.checkIn.value;
    data.checkOut = e.target.checkOut.value;
    data.guests = e.target.guests.value;
  } else {
    // UPDATED payload keys to match backend update_entry.php
    data.startDate = e.target.startDate.value;
    data.endDate = e.target.endDate.value;
    data.travelers = e.target.travelers.value;
  }

  ajaxPost("api/update_entry.php", data, (err, res) => {
    if (res && res.success) {
      showToast("Successfully updated!", "success");
      document.getElementById("editModal").classList.remove("show");
      loadBookings(); // Instantly refresh the tables with new data
    } else {
      showToast("Failed to update.", "error");
    }
  });
}
