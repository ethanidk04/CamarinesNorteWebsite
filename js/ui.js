import { DESTINATIONS, FOODS, RESTOS, FESTIVALS, MUNIS } from "./data.js";
import { ajaxPost, ajaxGet, escapeQuote } from "./utils.js";

let currentTrips = [];
let currentReservations = [];
let lastSavedTrip = null; // for "Book a hotel for these dates" after saving

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

  // Transport, budget and travelers always have a default, so those don't count as "started"
  const started = PLAN_FIELDS.some((name) => {
    if (name === "transportMode" || name === "budget") return false;
    if (name === "travelers") return fields[name] !== form.travelers.defaultValue;
    return fields[name];
  });

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
  if (id === "auth") {
    openAuthModal();
    return;
  }

  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const target = document.getElementById("page-" + id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document
    .querySelectorAll(".nav-link, .nav-dropdown-item")
    .forEach((l) => l.classList.remove("active"));

  const directLink = document.querySelector(`.nav-link[data-page="${id}"]`);
  if (directLink) directLink.classList.add("active");

  if (id === "explore" || id === "food" || id === "festivals") {
    const exploreBtn = document.getElementById("exploreDropdownBtn");
    if (exploreBtn) exploreBtn.classList.add("active");
    const activeItem = document.querySelector(`.nav-dropdown-menu [data-page="${id}"]`);
    if (activeItem) activeItem.classList.add("active");
  }

  closeAllDropdowns();

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

const MONTH_TIP_DEFAULT =
  '<i class="ti ti-info-circle"></i><span>Pick a month to see local travel tips.</span>';

export function showMonthTip(btn, month, tip) {
  const t = document.getElementById("month-tip");
  const isActive = btn.classList.contains("active");

  // Reset all
  document.querySelectorAll(".month-btn").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  t.className = "month-tip";

  // Clicking the open month again closes it
  if (isActive) {
    t.innerHTML = MONTH_TIP_DEFAULT;
    return;
  }

  const season = btn.classList.contains("peak")
    ? "peak"
    : btn.classList.contains("shoulder")
      ? "shoulder"
      : "offpeak";
  const seasonLabel = { peak: "Peak", shoulder: "Shoulder", offpeak: "Off-peak" }[season];

  btn.classList.add("active");
  btn.setAttribute("aria-pressed", "true");
  t.classList.add("show", "month-tip--" + season);
  t.innerHTML = `<i class="ti ti-calendar-event"></i>
    <div>
      <div class="month-tip-head"><strong>${month}</strong><span>${seasonLabel} season</span></div>
      <p>${tip}</p>
    </div>`;
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
        lastSavedTrip = data;
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
  if (formId === "reserveForm") updateStaySummary();
}

// ======================= NUMBER STEPPER =======================
// Keeps a typed number inside the input's min/max (empty or junk goes back to min)
export function clampNumber(input) {
  const min = Number(input.min) || 1;
  const max = Number(input.max) || Infinity;
  const n = Math.round(Number(input.value));
  input.value = Number.isFinite(n) && input.value !== "" ? Math.min(max, Math.max(min, n)) : min;
}

export function stepNumber(btn, delta) {
  const input = btn.parentElement.querySelector("input");
  const before = input.value;
  input.value = (Number(input.value) || 0) + delta;
  clampNumber(input);
  // Let the form's own listeners (draft save, stay summary) see the change
  if (input.value !== before) input.dispatchEvent(new Event("input", { bubbles: true }));
}

// ======================= DATE / TEXT HELPERS =======================
// Parses "YYYY-MM-DD" as a local date (new Date("2026-12-20") would be UTC)
function parseISODate(s) {
  const [y, m, d] = String(s || "").split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

function nightsBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

function formatRange(a, b) {
  const short = { month: "short", day: "numeric" };
  const full = { month: "short", day: "numeric", year: "numeric" };
  if (a.getFullYear() === b.getFullYear()) {
    return `${a.toLocaleDateString("en-US", short)} – ${b.toLocaleDateString("en-US", full)}`;
  }
  return `${a.toLocaleDateString("en-US", full)} – ${b.toLocaleDateString("en-US", full)}`;
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

// Live "3 nights · Dec 20 – Dec 23, 2026 · 2 guests" line under the reservation fields
export function updateStaySummary() {
  const form = document.getElementById("reserveForm");
  const box = document.getElementById("staySummary");
  if (!form || !box) return;

  const checkIn = parseISODate(form.checkIn.value);
  const checkOut = parseISODate(form.checkOut.value);
  if (!checkIn || !checkOut) {
    box.className = "stay-summary hidden";
    return;
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    box.className = "stay-summary is-error";
    box.innerHTML =
      '<i class="ti ti-alert-circle"></i><span>Check-out needs to be at least one day after check-in.</span>';
    return;
  }

  const guests = Number(form.guests.value);
  const parts = [`<strong>${plural(nights, "night")}</strong>`, formatRange(checkIn, checkOut)];
  if (guests > 0) parts.push(plural(guests, "guest"));
  if (form.roomType.value) parts.push(esc(form.roomType.value));

  box.className = "stay-summary";
  box.innerHTML = `<i class="ti ti-moon"></i><span>${parts.join(" · ")}</span>`;
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
      // Don't leave the lists stuck on "Loading..."
      const failed = `<div class="empty-bookings">
        <i class="ti ti-cloud-off"></i>
        <h3>Couldn't load your trips</h3>
        <p>Check your connection, then try again.</p>
        <button type="button" class="btn-primary" onclick="loadBookings()"><i class="ti ti-refresh"></i> Try again</button>
      </div>`;
      if (hotelsWrap) hotelsWrap.innerHTML = failed;
      if (tripsWrap) tripsWrap.innerHTML = failed;
      return;
    }

    // Save trips globally so we can edit them
    currentTrips = data.tripplans || [];
    currentReservations = Array.isArray(data.reservations) ? data.reservations : [];

    renderBookingsTable("hotels-table-wrap", data.reservations, "reservation");
    renderBookingsTable("trips-table-wrap", currentTrips, "trip");
    updateTripCounts(data.success === false ? null : data.reservations || [], currentTrips);
  });
}

export function renderBookingsTable(containerId, records, type) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const isReservation = type === "reservation";

  if (!records || records.length === 0 || records.success === false) {
    let title, body, action;
    if (!isLoggedIn) {
      title = isReservation ? "Log in to see your reservations" : "Log in to save your trips";
      body = isReservation
        ? "Your hotel bookings are saved to your account."
        : "Saved itineraries are kept in your account so you can edit them later.";
      action = `<button type="button" class="btn-primary" onclick="openAuthModal()"><i class="ti ti-login"></i> Log in</button>`;
    } else if (isReservation) {
      title = "No reservations yet";
      body = "When you book a hotel, it will show up here.";
      action = `<button type="button" class="btn-primary" onclick="showPage('reserve')"><i class="ti ti-plus"></i> Book a stay</button>`;
    } else {
      title = "No saved itineraries yet";
      body = "Trips you save in the trip planner will show up here.";
      action = `<button type="button" class="btn-primary" onclick="showPage('plan')"><i class="ti ti-plus"></i> Plan a trip</button>`;
    }
    el.innerHTML = `<div class="empty-bookings">
      <i class="ti ${isReservation ? "ti-calendar-off" : "ti-map-off"}"></i>
      <h3>${title}</h3>
      <p>${body}</p>
      ${action}
    </div>`;
    return;
  }

  if (isReservation) {
    el.innerHTML = `<div class="booking-list">${records
      .map((r) => {
        const checkIn = parseISODate(r.checkIn);
        const checkOut = parseISODate(r.checkOut);
        const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
        const dates =
          checkIn && checkOut
            ? formatRange(checkIn, checkOut)
            : `${esc(r.checkIn)} – ${esc(r.checkOut)}`;
        const guests = Number(r.guests);
        const status = r.status || "Confirmed";
        const statusClass = status === "Confirmed" ? "status-confirmed" : "status-pending";

        return `<article class="booking-item" data-record="reservation-${r.id}">
          <div class="booking-date" aria-hidden="true">
            <span>${checkIn ? checkIn.toLocaleDateString("en-US", { month: "short" }) : "—"}</span>
            <strong>${checkIn ? checkIn.getDate() : ""}</strong>
          </div>
          <div class="booking-main">
            <div class="booking-title-row">
              <h3 class="booking-title">${esc(r.hotel)}</h3>
              <span class="status-badge ${statusClass}">${esc(status)}</span>
            </div>
            <div class="booking-meta">
              <span><i class="ti ti-calendar"></i>${dates}${nights > 0 ? ` · ${plural(nights, "night")}` : ""}</span>
              ${r.roomType ? `<span><i class="ti ti-bed"></i>${esc(r.roomType)}</span>` : ""}
              ${guests > 0 ? `<span><i class="ti ti-users"></i>${plural(guests, "guest")}</span>` : ""}
            </div>
            <div class="booking-id">${esc(r.transactionId)}</div>
          </div>
          <div class="booking-actions">
            <button type="button" class="btn-sm btn-sm--primary" onclick="openEditModal(${r.id}, 'reservation', '${r.checkIn}', '${r.checkOut}', '${r.guests}')"><i class="ti ti-edit"></i> Edit</button>
            <button type="button" class="btn-sm btn-sm--danger" onclick="cancelBooking(${r.id}, 'reservation')"><i class="ti ti-trash"></i> Delete</button>
          </div>
        </article>`;
      })
      .join("")}</div>`;
  } else {
    el.innerHTML = `<div class="trip-grid">${records
      .map((r) => {
        const start = parseISODate(r.startDate);
        const end = parseISODate(r.endDate);
        const days = start && end ? nightsBetween(start, end) + 1 : 0;
        const dates =
          start && end ? formatRange(start, end) : `${esc(r.startDate)} – ${esc(r.endDate)}`;
        const travelers = Number(r.travelers);
        const spots = r.touristSpots ? r.touristSpots.split(", ").filter(Boolean) : [];
        const shownSpots = spots.slice(0, 3);
        // "Mid-Range (₱3,000–₱7,000/day)" -> "Mid-Range"
        const budget = r.budget ? String(r.budget).split(" (")[0] : "";

        return `<article class="trip-card" data-record="trip-${r.id}">
          <div>
            <h3 class="trip-card-title">${esc(r.tripName)}</h3>
            <div class="booking-id">${esc(r.transactionId)}</div>
          </div>
          <ul class="trip-card-meta">
            <li><i class="ti ti-calendar"></i>${dates}${days > 0 ? ` · ${plural(days, "day")}` : ""}</li>
            ${r.destination ? `<li><i class="ti ti-map-pin"></i>${esc(r.destination)}</li>` : ""}
            ${travelers > 0 ? `<li><i class="ti ti-users"></i>${plural(travelers, "traveler")}</li>` : ""}
            ${budget ? `<li><i class="ti ti-wallet"></i>${esc(budget)}</li>` : ""}
          </ul>
          ${
            spots.length
              ? `<div class="trip-card-spots">${shownSpots
                  .map((s) => `<span class="trip-spot">${esc(s)}</span>`)
                  .join("")}${
                  spots.length > shownSpots.length
                    ? `<span class="trip-spot trip-spot--more">+${spots.length - shownSpots.length} more</span>`
                    : ""
                }</div>`
              : ""
          }
          <div class="trip-card-actions">
            <button type="button" class="btn-sm btn-sm--primary" onclick="bookHotelForTrip(${r.id})"><i class="ti ti-building"></i> Book hotel</button>
            <button type="button" class="btn-sm" onclick="editTripPlan(${r.id})"><i class="ti ti-edit"></i> Edit</button>
            <button type="button" class="btn-sm btn-sm--danger" onclick="cancelBooking(${r.id}, 'trip')" aria-label="Delete itinerary"><i class="ti ti-trash"></i> Delete</button>
          </div>
        </article>`;
      })
      .join("")}</div>`;
  }
}

export function editTripPlan(id) {
  // Use == instead of === in case the database returns the ID as a string
  const trip = currentTrips.find((t) => t.id == id);
  if (!trip) return;

  // Saved itineraries live on My Trips; the form is on the Plan Trip page
  if (!document.getElementById("page-plan").classList.contains("active")) {
    showPage("plan");
  }

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
  document.querySelectorAll(".trips-tab").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  document
    .querySelectorAll("#page-bookings .tab-content")
    .forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");
  document.getElementById("tab-" + tabId).classList.add("active");

  // The header button follows the tab: book a hotel, or plan a trip
  const primary = document.getElementById("myTripsPrimaryBtn");
  if (primary) {
    const isTrips = tabId === "trips";
    primary.innerHTML = isTrips
      ? '<i class="ti ti-plus"></i> Plan a trip'
      : '<i class="ti ti-plus"></i> Book a stay';
    primary.onclick = () => showPage(isTrips ? "plan" : "reserve");
  }
}

// Opens My Trips on a given tab ("hotels" or "trips")
export function openMyTrips(tabId = "hotels") {
  showPage("bookings");
  const btn = document.getElementById("tabBtn-" + tabId);
  if (btn) switchBookingTab(btn, tabId);
}

// Tab counts on My Trips + the "You have N saved itineraries" link on Plan Trip.
// Pass null when logged out to hide them.
function updateTripCounts(reservations, trips) {
  const hotelsCount = document.getElementById("hotelsCount");
  const tripsCount = document.getElementById("tripsCount");
  const nHotels = Array.isArray(reservations) ? reservations.length : null;
  const nTrips = Array.isArray(trips) ? trips.length : null;
  if (hotelsCount) hotelsCount.textContent = nHotels ?? "";
  if (tripsCount) tripsCount.textContent = nTrips ?? "";

  const link = document.getElementById("planSavedLink");
  if (link) {
    link.classList.toggle("hidden", !nTrips);
    document.getElementById("planSavedText").textContent = nTrips
      ? `You have ${nTrips} saved ${nTrips === 1 ? "itinerary" : "itineraries"}.`
      : "";
  }
}

// Opens the hotel booking with a trip's dates and group size filled in.
// No id = the itinerary that was just saved.
export function bookHotelForTrip(id) {
  const trip = id == null ? lastSavedTrip : currentTrips.find((t) => t.id == id);
  showPage("reserve");
  if (!trip) return;

  resetForm("reserveForm", "reserve-form-wrap", "reserve-success");
  const form = document.getElementById("reserveForm");
  form.checkIn.value = trip.startDate || "";
  form.checkOut.value = trip.endDate || "";
  const travelers = Number(trip.travelers);
  if (travelers > 0) form.guests.value = Math.min(travelers, Number(form.guests.max) || travelers);
  updateStaySummary();
  showToast(`Dates filled in from "${esc(trip.tripName)}"`, "success");
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
  closeAuthModal();
  checkAuthAndLockForms();

  // Logged in from the Save popup: stay on the page and finish saving the trip
  if (pendingPlanSave) {
    document.getElementById("planForm").requestSubmit();
    return;
  }

  loadBookings();
}

export function openAuthModal(source) {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  const saveNote = document.getElementById("authSaveNote");
  if (saveNote) {
    if (pendingPlanSave || source === "draft") {
      saveNote.classList.remove("hidden");
    } else {
      saveNote.classList.add("hidden");
    }
  }

  switchAuthTab("login");
  modal.classList.add("show");
}

export function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.remove("show");
  pendingPlanSave = false;
  clearRegErrors();
}

export function switchAuthTab(tab) {
  const loginBtn = document.getElementById("modalTabBtnLogin");
  const regBtn = document.getElementById("modalTabBtnRegister");
  const loginView = document.getElementById("modal-login-view");
  const regView = document.getElementById("modal-register-view");

  clearRegErrors();

  if (tab === "register") {
    if (loginBtn) loginBtn.classList.remove("active");
    if (regBtn) regBtn.classList.add("active");
    if (loginView) loginView.classList.add("hidden");
    if (regView) regView.classList.remove("hidden");
  } else {
    if (loginBtn) loginBtn.classList.add("active");
    if (regBtn) regBtn.classList.remove("active");
    if (loginView) loginView.classList.remove("hidden");
    if (regView) regView.classList.add("hidden");
  }
}

export function toggleDropdown(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const el = document.getElementById(id);
  if (!el) return;
  const wasOpen = el.classList.contains("open");
  closeAllDropdowns();
  if (!wasOpen) {
    el.classList.add("open");
  }
}

export function closeAllDropdowns() {
  document
    .querySelectorAll(".nav-dropdown.open, .nav-user-dropdown.open")
    .forEach((el) => el.classList.remove("open"));
}

export function logoutUser() {
  fetch("api/logout.php")
    .then(() => {
      showToast("Logged out successfully", "info");
      setTimeout(() => window.location.reload(), 300);
    })
    .catch(() => window.location.reload());
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

function showRegFieldError(fieldName, message, form) {
  const targetForm =
    form ||
    document.getElementById("modalRegisterForm") ||
    document.getElementById("registerForm");
  const errEl = targetForm
    ? targetForm.querySelector(`.field-error[data-field='${fieldName}']`) ||
      targetForm.querySelector("#reg-err-" + fieldName)
    : document.getElementById("reg-err-" + fieldName);
  const input = targetForm ? targetForm[fieldName] : null;
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add("visible");
  }
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
  if (!form.firstName.value.trim()) { showRegFieldError("firstName", "First name is required.", form); hasError = true; }
  if (!form.lastName.value.trim())  { showRegFieldError("lastName",  "Last name is required.", form);  hasError = true; }
  if (!form.email.value.trim())     { showRegFieldError("email",     "Email is required.", form);      hasError = true; }
  if (!form.password.value)         { showRegFieldError("password",  "Password is required.", form);   hasError = true; }
  else if (form.password.value.length < 8) { showRegFieldError("password", "Password must be at least 8 characters.", form); hasError = true; }
  if (!form.phone.value.trim())     { showRegFieldError("phone",     "Phone number is required.", form); hasError = true; }
  if (!form.govId.value.trim())     { showRegFieldError("govId",     "Gov ID / Passport is required.", form); hasError = true; }
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
      showRegFieldError("email", res ? res.message : "Registration failed. Please try again.", form);
    }
  });
}

// ======================= DELETE CONFIRMATION =======================
let pendingDelete = null; // { id, targetType } while the dialog is open
let deleteReturnFocus = null;
let deleteBusy = false;

const DELETE_COPY = {
  reservation: {
    title: "Delete this reservation?",
    body: "This removes the hotel booking from your account. It can't be undone.",
    confirm: "Delete reservation",
    done: "Reservation deleted.",
  },
  trip: {
    title: "Delete this itinerary?",
    body: "This removes the trip plan from your account. It can't be undone. Hotel reservations you made for this trip are not affected.",
    confirm: "Delete itinerary",
    done: "Itinerary deleted.",
  },
};

// Opens the confirmation dialog (name kept because the cards already call it)
export function cancelBooking(id, targetType) {
  const isTrip = targetType === "trip";
  const copy = DELETE_COPY[isTrip ? "trip" : "reservation"];
  const record = (isTrip ? currentTrips : currentReservations).find((r) => r.id == id);

  pendingDelete = { id, targetType };
  deleteReturnFocus = document.activeElement;

  document.getElementById("deleteTitle").textContent = copy.title;
  document.getElementById("deleteBody").textContent = copy.body;
  document.getElementById("deleteConfirmBtn").innerHTML =
    `<i class="ti ti-trash"></i> ${copy.confirm}`;

  // Show exactly what is about to be deleted
  const item = document.getElementById("deleteItem");
  if (record) {
    const start = parseISODate(isTrip ? record.startDate : record.checkIn);
    const end = parseISODate(isTrip ? record.endDate : record.checkOut);
    const dates = start && end ? formatRange(start, end) : "";
    const length =
      start && end
        ? isTrip
          ? plural(nightsBetween(start, end) + 1, "day")
          : plural(nightsBetween(start, end), "night")
        : "";
    item.innerHTML = `<i class="ti ${isTrip ? "ti-map-2" : "ti-building"}"></i>
      <div>
        <div class="delete-modal-item-title">${esc(isTrip ? record.tripName : record.hotel)}</div>
        <div class="delete-modal-item-meta">${[dates, length].filter(Boolean).join(" · ")}</div>
        <div class="booking-id">${esc(record.transactionId)}</div>
      </div>`;
    item.classList.remove("hidden");
  } else {
    item.classList.add("hidden");
  }

  document.getElementById("deleteModal").classList.add("show");
  // The safe choice gets focus, so a stray Enter doesn't delete anything
  setTimeout(() => document.getElementById("deleteKeepBtn").focus(), 50);
}

export function closeDeleteModal() {
  if (deleteBusy) return;
  const modal = document.getElementById("deleteModal");
  if (!modal || !modal.classList.contains("show")) return;
  modal.classList.remove("show");
  pendingDelete = null;

  // Back to the button that opened it, or the active tab if that card is gone
  const back =
    deleteReturnFocus && deleteReturnFocus.isConnected
      ? deleteReturnFocus
      : document.querySelector(".trips-tab.active");
  if (back) back.focus();
}

// Keeps Tab inside the dialog while it is open
export function trapDeleteFocus(e) {
  if (e.key !== "Tab") return;
  const buttons = [
    document.getElementById("deleteKeepBtn"),
    document.getElementById("deleteConfirmBtn"),
  ];
  const i = buttons.indexOf(document.activeElement);
  e.preventDefault();
  buttons[(i + (e.shiftKey ? buttons.length - 1 : 1)) % buttons.length].focus();
}

export function confirmDelete() {
  if (!pendingDelete || deleteBusy) return;
  const { id, targetType } = pendingDelete;
  const copy = DELETE_COPY[targetType === "trip" ? "trip" : "reservation"];
  const btn = document.getElementById("deleteConfirmBtn");

  deleteBusy = true;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Deleting...';

  ajaxPost("api/delete_entry.php", { id: id, target: targetType }, (err, res) => {
    deleteBusy = false;
    btn.disabled = false;
    btn.innerHTML = `<i class="ti ti-trash"></i> ${copy.confirm}`;

    if (res && res.success) {
      deleteReturnFocus = null; // its card is about to disappear
      closeDeleteModal();
      showToast(copy.done, "success");
      // Let the card fade out before the list re-renders
      const card = document.querySelector(`[data-record="${targetType}-${id}"]`);
      if (card) card.classList.add("is-removing");
      setTimeout(loadBookings, card ? 260 : 0);
    } else {
      // Keep the dialog open so they can try again
      showToast(res && res.message ? res.message : "Couldn't delete. Please try again.", "error");
    }
  });
}

let isLoggedIn = false;
let pendingPlanSave = false; // true while the Save popup is waiting for a login

export function checkAuthAndLockForms() {
  ajaxGet("api/check_session.php", (err, res) => {
    applyAuthState(!!(res && res.loggedIn), res ? res.user : null);
  });
}

function applyAuthState(loggedIn, user) {
  isLoggedIn = loggedIn;
  const resWrap = document.getElementById("reserve-form-wrap");
  const lock = document.getElementById("reserve-lock");

  // Desktop nav elements
  const navAuthBtn = document.getElementById("navAuthBtn");
  const navUserDropdown = document.getElementById("navUserDropdown");
  const navUserName = document.getElementById("navUserName");
  const navUserAvatar = document.getElementById("navUserAvatar");
  const userMenuEmail = document.getElementById("userMenuEmail");

  // Mobile drawer elements
  const drawerAuthBtn = document.getElementById("drawerAuthBtn");
  const drawerUserProfile = document.getElementById("drawerUserProfile");
  const drawerUserName = document.getElementById("drawerUserName");
  const drawerUserAvatar = document.getElementById("drawerUserAvatar");
  const drawerUserEmail = document.getElementById("drawerUserEmail");
  const drawerBookingsItem = document.getElementById("drawerBookingsItem");
  const drawerLogoutItem = document.getElementById("drawerLogoutItem");

  if (loggedIn) {
    const fullName =
      user && (user.firstName || user.lastName)
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "My Account";
    const displayName =
      user && user.firstName
        ? user.firstName + (user.lastName ? ` ${user.lastName.charAt(0)}.` : "")
        : "My Account";
    const initials =
      user && user.firstName
        ? (
            user.firstName.charAt(0) +
            (user.lastName ? user.lastName.charAt(0) : "")
          ).toUpperCase()
        : "CN";
    const email = (user && user.email) || "Member";

    if (navAuthBtn) navAuthBtn.classList.add("hidden");
    if (navUserDropdown) navUserDropdown.classList.remove("hidden");
    if (navUserName) navUserName.textContent = displayName;
    if (navUserAvatar) navUserAvatar.textContent = initials;
    if (userMenuEmail) userMenuEmail.textContent = email;

    if (drawerAuthBtn) drawerAuthBtn.classList.add("hidden");
    if (drawerUserProfile) drawerUserProfile.classList.remove("hidden");
    if (drawerUserName) drawerUserName.textContent = fullName;
    if (drawerUserAvatar) drawerUserAvatar.textContent = initials;
    if (drawerUserEmail) drawerUserEmail.textContent = email;
    if (drawerBookingsItem) drawerBookingsItem.classList.remove("hidden");
    if (drawerLogoutItem) drawerLogoutItem.classList.remove("hidden");

    // Unlock the Hotel Booking Form
    if (lock) {
      lock.remove();
      if (resWrap) resWrap.classList.remove("hidden");
    }

    loadBookings();
  } else {
    if (navAuthBtn) navAuthBtn.classList.remove("hidden");
    if (navUserDropdown) navUserDropdown.classList.add("hidden");

    if (drawerAuthBtn) drawerAuthBtn.classList.remove("hidden");
    if (drawerUserProfile) drawerUserProfile.classList.add("hidden");
    if (drawerBookingsItem) drawerBookingsItem.classList.add("hidden");
    if (drawerLogoutItem) drawerLogoutItem.classList.add("hidden");

    // Lock the Hotel Booking Form
    if (resWrap && !lock) {
      resWrap.classList.add("hidden");
      resWrap.insertAdjacentHTML(
        "beforebegin",
        `<div id="reserve-lock" style="text-align:center; padding: 60px 20px; background: #fff; border-radius: 12px; box-shadow: var(--shadow);">
              <i class="ti ti-lock" style="font-size: 48px; color: var(--light-gray); margin-bottom: 16px; display:inline-block;"></i>
              <h3 style="margin-bottom: 8px;">Authentication Required</h3>
              <p style="color:var(--gray); margin-bottom: 24px;">You must be logged in to your account to book a hotel reservation.</p>
              <button class="btn-primary" onclick="openAuthModal()">Go to Login</button>
            </div>`,
      );
    }

    renderBookingsTable("hotels-table-wrap", [], "reservation");
    renderBookingsTable("trips-table-wrap", [], "trip");
    updateTripCounts(null, null);
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
