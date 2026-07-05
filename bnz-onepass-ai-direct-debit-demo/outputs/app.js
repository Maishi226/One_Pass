const cases = {
  emily: {
    phase: "consumer",
    phaseLabel: "Consumer",
    phaseNumber: "Phase 1",
    name: "Emily Chen",
    scenario: "Move-in power setup",
    partner: "Mercury",
    risk: "Low",
    title: "Move-in power setup",
    subtitle: "Identity credential + Direct Debit + bill guardian",
    ai: "OnePass verifies Emily once, pre-fills Mercury onboarding, recommends a $180 payment cap, and keeps protecting her after activation.",
    opportunity: "Consumer engagement",
    outcome: "approved",
    checks: [
      ["Passport / RealMe identity", "Pass", "Verified identity without sharing passport PDF"],
      ["Proof of address", "Pass", "New address confirmed from trusted bank data"],
      ["Account standing", "Pass", "No arrears or active hardship flag"],
      ["Direct Debit safety", "Pass", "Eligible with $180 monthly cap"],
    ],
    decision: {
      heading: "Instant onboarding approved",
      body: "Mercury receives a privacy-preserving identity claim and a real-time Direct Debit mandate. Emily’s power account can activate immediately.",
      primary: "Activate Mercury account",
      secondary: "Open permission wallet",
    },
  },
  josh: {
    phase: "consumer",
    phaseLabel: "Consumer",
    phaseNumber: "Phase 1",
    name: "Josh Taylor",
    scenario: "Move-in power setup",
    partner: "Mercury",
    risk: "High",
    title: "Manual support required",
    subtitle: "Identity passes, financial safety does not",
    ai: "OnePass does not blindly approve every user. Josh’s identity passes, but recent arrears and returned payments block automatic Direct Debit setup.",
    opportunity: "Safer onboarding",
    outcome: "manual",
    checks: [
      ["Passport / RealMe identity", "Pass", "Identity verified"],
      ["Account standing", "Review", "Recent returned payments detected"],
      ["Arrears and collections", "Fail", "Outstanding debt signal requires discussion"],
      ["Direct Debit safety", "Blocked", "Manual payment arrangement needed"],
    ],
    decision: {
      heading: "Manual review required",
      body: "BNZ routes Josh to a support specialist with the failed-check context. Mercury avoids bad debt risk, while Josh is not rejected silently.",
      primary: "Create support handoff",
      secondary: "Switch customer",
    },
  },
  maya: {
    phase: "consumer",
    phaseLabel: "Consumer",
    phaseNumber: "Phase 1",
    name: "Maya Patel",
    scenario: "New rental setup",
    partner: "OnePass partner bundle",
    risk: "Low",
    title: "AI service bundle",
    subtitle: "Power, broadband, insurance and address update",
    ai: "Because Maya is moving into a new rental, OnePass can pre-fill multiple partner forms and recommend broadband, contents insurance and address-change tasks.",
    opportunity: "Cross-sell moment",
    outcome: "bundle",
    checks: [
      ["Identity credential", "Pass", "Reusable verified digital identity ready"],
      ["Address change", "Pass", "Move-in date and rental address detected"],
      ["Partner consent", "Pass", "Maya approves which services can receive data"],
      ["AI recommendation", "Pass", "Relevant services ranked by move context"],
    ],
    decision: {
      heading: "Service bundle ready",
      body: "OnePass can complete several onboarding journeys from one consent screen, reducing repeated forms and strengthening BNZ’s relationship with Maya.",
      primary: "Share identity with selected partners",
      secondary: "Open permission wallet",
    },
  },
  greenbyte: {
    phase: "finance",
    phaseLabel: "Business Finance",
    phaseNumber: "Phase 2",
    name: "GreenByte Ltd",
    scenario: "EV van lease",
    partner: "FleetLease NZ",
    risk: "Medium",
    title: "AI-powered business finance",
    subtitle: "Real-time cash-flow analysis at transaction point",
    ai: "GreenByte uses OnePass to verify its business identity for a vehicle lease. BNZ AI analyses cash flow and detects a short-term funding need.",
    opportunity: "$42k pre-approved loan",
    outcome: "loan",
    checks: [
      ["NZBN / director identity", "Pass", "Business and authorised director verified"],
      ["Cash-flow trend", "Pass", "Stable revenue over the last six months"],
      ["Lease affordability", "Review", "Large upfront cost creates short-term gap"],
      ["BNZ finance fit", "Pass", "Pre-approved business loan can be offered now"],
    ],
    decision: {
      heading: "$42,000 loan pre-approved",
      body: "BNZ offers funding exactly when GreenByte needs it, inside the lease journey, without a separate manual loan application.",
      primary: "Accept pre-approved loan",
      secondary: "Continue without finance",
    },
  },
  harbour: {
    phase: "finance",
    phaseLabel: "Business Finance",
    phaseNumber: "Phase 2",
    name: "Harbour Dental",
    scenario: "Equipment purchase",
    partner: "MedEquip Supplier",
    risk: "Medium",
    title: "Equipment finance signal",
    subtitle: "AI detects working-capital pressure",
    ai: "Harbour Dental is buying a $95k scanner. OnePass verifies the business and BNZ AI spots that a staged loan would protect operating cash.",
    opportunity: "$65k equipment finance",
    outcome: "loan",
    checks: [
      ["Business identity", "Pass", "NZBN and owner authority verified"],
      ["Invoice authenticity", "Pass", "Supplier invoice matches verified partner"],
      ["Cash buffer", "Review", "Purchase would reduce cash buffer below policy"],
      ["Finance eligibility", "Pass", "Equipment finance available"],
    ],
    decision: {
      heading: "$65,000 equipment finance offered",
      body: "BNZ turns a verified transaction into a personalised finance moment, helping the business grow without draining working capital.",
      primary: "Show finance terms",
      secondary: "Pay from account",
    },
  },
  kiwifresh: {
    phase: "trustlock",
    phaseLabel: "Trust-Lock B2B",
    phaseNumber: "Phase 3",
    name: "KiwiFresh Foods",
    scenario: "Supplier payment for cold-storage units",
    partner: "South Island Cooling Co",
    risk: "Controlled",
    title: "Trust-Lock B2B settlement",
    subtitle: "Funds held until delivery and acceptance",
    ai: "OnePass becomes a trusted transaction layer. BNZ holds funds, monitors delivery risk, and releases payment only when goods are accepted.",
    opportunity: "B2B platform fee + trade finance",
    outcome: "trustlock",
    checks: [
      ["Buyer identity", "Pass", "KiwiFresh authorised signer verified"],
      ["Supplier identity", "Pass", "Supplier bank account and NZBN matched"],
      ["Transaction risk", "Review", "High-value cross-island delivery monitored"],
      ["Trust-Lock terms", "Pass", "Funds held until delivery acceptance"],
    ],
    decision: {
      heading: "Trust-Lock activated",
      body: "BNZ secures the buyer and supplier: funds are reserved now, released after confirmed delivery, and monitored by AI for fraud or dispute risk.",
      primary: "Lock funds with BNZ",
      secondary: "View settlement timeline",
    },
  },
};

const phaseOrder = { consumer: 1, finance: 2, trustlock: 3 };
const state = {
  selected: "emily",
  screen: "waiting",
  token: null,
  identity: "Not checked",
  financialAI: "Not checked",
  outcome: "Pending",
  opportunity: "None yet",
  permissions: ["Mercury", "Old landlord", "Old power company"],
  events: [],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const current = () => cases[state.selected];

function now() {
  return new Date().toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function code(prefix) {
  return `${prefix}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(16).toUpperCase().slice(0, 6)}`;
}

function event(title, detail) {
  state.events.unshift({ time: now(), title, detail });
  if (state.events.length > 9) state.events.pop();
  render();
}

function setScreen(name) {
  state.screen = name;
  $$(".screen").forEach((screen) => screen.classList.toggle("is-visible", screen.dataset.screen === name));
  render();
}

function renderChecks() {
  const c = current();
  $("#checkList").innerHTML = c.checks
    .map(([label, result, detail]) => {
      const tone = result === "Pass" ? "pass" : result === "Fail" || result === "Blocked" ? "fail" : "review";
      return `<div class="trust-check ${tone}"><div><strong>${label}</strong><span>${detail}</span></div><b>${result}</b></div>`;
    })
    .join("");
}

function renderDecision() {
  const c = current();
  const icon = c.outcome === "manual" ? "!" : c.outcome === "trustlock" ? "✓" : "$";
  const tone = c.outcome === "manual" ? "manual-icon" : "check";
  $("#decisionCard").innerHTML = `
    <div class="manual-card">
      <span class="${tone}">${icon}</span>
      <h2>${c.decision.heading}</h2>
      <p>${c.decision.body}</p>
    </div>
  `;
  $("#primaryActionBtn").textContent = c.decision.primary;
  $("#secondaryActionBtn").textContent = c.decision.secondary;
}

function renderPermissions() {
  const permissions =
    current().phase === "trustlock"
      ? ["Buyer identity", "Supplier identity", "Settlement terms", "Delivery acceptance signal"]
      : current().phase === "finance"
        ? ["Business identity", "Cash-flow analysis", "Loan offer consent", "Partner transaction data"]
        : state.permissions;
  $("#permissionList").innerHTML = permissions
    .map(
      (item) => `
      <label class="permission">
        <input type="checkbox" checked data-permission="${item}" />
        <span><strong>${item}</strong><small>Consent managed by BNZ OnePass</small></span>
      </label>
    `,
    )
    .join("");
}

function render() {
  const c = current();
  $("#railPhase").textContent = c.phaseNumber;
  $("#railRisk").textContent = c.risk;
  $("#partnerName").textContent = c.partner;
  $("#partnerTitle").textContent = c.title;
  $("#customerName").value = c.name;
  $("#scenarioName").value = c.scenario;
  $("#scenarioPartner").value = c.partner;
  $("#handoffCode").textContent = state.token || "Pending";
  $("#appStatus").textContent = state.screen === "waiting" ? "Waiting for request" : c.phaseLabel;
  $("#waitingTitle").textContent = c.name;
  $("#waitingCopy").textContent = c.ai;
  $("#partnerInitial").textContent = c.partner.slice(0, 1);
  $("#requestTitle").textContent = `${c.partner} requests BNZ OnePass`;
  $("#requestSubtitle").textContent = c.subtitle;
  $("#aiNarrative").textContent = c.ai;
  $("#capInline").textContent = c.name === "Emily Chen" ? "$180" : "$150";
  $("#scenarioPill").textContent = c.phaseNumber;
  $("#customerState").textContent = c.name;
  $("#phaseState").textContent = c.phaseLabel;
  $("#identityState").textContent = state.identity;
  $("#riskState").textContent = state.financialAI;
  $("#outcomeState").textContent = state.outcome;
  $("#opportunityState").textContent = state.opportunity;
  $$(".step").forEach((button) => button.classList.toggle("is-active", button.dataset.phase === c.phase));
  $$(".customer-card").forEach((button) => button.classList.toggle("is-selected", button.dataset.customer === state.selected));
  $("#timeline").innerHTML = state.events
    .map((item) => `<div class="event"><strong>${item.title}</strong><span>${item.time} · ${item.detail}</span></div>`)
    .join("");
  $("#stateJson").textContent = JSON.stringify(state, null, 2);
  renderChecks();
  renderDecision();
  renderPermissions();
}

function resetCase(id = state.selected) {
  state.selected = id;
  state.screen = "waiting";
  state.token = null;
  state.identity = "Not checked";
  state.financialAI = "Not checked";
  state.outcome = "Pending";
  state.opportunity = "None yet";
  state.permissions = ["Mercury", "Old landlord", "Old power company"];
  state.events = [];
  setScreen("waiting");
  event("Case selected", `${current().name} is ready for ${current().phaseLabel}`);
}

function connect() {
  state.token = code("OP");
  event("Consent token created", `${current().partner} opened OnePass for ${current().name}`);
  setScreen("checks");
}

function runChecks() {
  const c = current();
  state.identity = c.checks.some((check) => check[1] === "Fail") ? "Partial" : "Verified";
  state.financialAI = c.risk === "High" ? "Risk flagged" : c.risk === "Medium" ? "Finance opportunity detected" : "Clear";
  state.outcome =
    c.outcome === "manual"
      ? "Manual review required"
      : c.outcome === "loan"
        ? "Pre-approved finance ready"
        : c.outcome === "trustlock"
          ? "Trust-Lock ready"
          : "Approved";
  state.opportunity = c.opportunity;
  event("OnePass AI checks complete", `${c.phaseLabel}: ${state.outcome}`);
  setScreen("decision");
}

function primaryAction() {
  const c = current();
  if (c.outcome === "approved" || c.outcome === "bundle") {
    event("Identity shared with consent", `${c.partner} receives verified claims, not raw documents`);
    if (c.name === "Emily Chen") setScreen("guardian");
    else setScreen("wallet");
  } else if (c.outcome === "manual") {
    event("Support handoff created", "Customer and partner receive a clear next step");
    setScreen("wallet");
  } else if (c.outcome === "loan") {
    event("Finance offer accepted", `${c.opportunity} moved into the transaction journey`);
    setScreen("wallet");
  } else {
    event("Funds locked by BNZ", "Payment will release after delivery and acceptance");
    setScreen("wallet");
  }
}

function secondaryAction() {
  event("Alternative path selected", current().decision.secondary);
  setScreen("wallet");
}

function draftLetter() {
  event("AI dispute email drafted", "The bill jump is challenged before money leaves the account");
  setScreen("wallet");
}

function detectMove() {
  event("Move detected", "OnePass recommends revoking old service permissions");
}

function revokeOldPermissions() {
  state.permissions = ["Mercury"];
  event("Old permissions revoked", "Old landlord and old power company access closed");
  render();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function autoRun() {
  for (const id of ["emily", "josh", "greenbyte", "kiwifresh"]) {
    resetCase(id);
    await wait(350);
    connect();
    await wait(500);
    runChecks();
    await wait(550);
    primaryAction();
    await wait(650);
  }
}

$("#connectBtn").addEventListener("click", connect);
$("#runChecksBtn").addEventListener("click", runChecks);
$("#primaryActionBtn").addEventListener("click", primaryAction);
$("#secondaryActionBtn").addEventListener("click", secondaryAction);
$("#letterBtn").addEventListener("click", draftLetter);
$("#moveBtn").addEventListener("click", detectMove);
$("#revokeBtn").addEventListener("click", revokeOldPermissions);
$("#resetBtn").addEventListener("click", () => resetCase());
$("#autoBtn").addEventListener("click", autoRun);

$$("[data-customer]").forEach((button) => {
  button.addEventListener("click", () => resetCase(button.dataset.customer));
});

$$("[data-phase]").forEach((button) => {
  button.addEventListener("click", () => {
    const firstInPhase = Object.entries(cases).find(([, item]) => item.phase === button.dataset.phase)?.[0];
    if (firstInPhase) resetCase(firstInPhase);
  });
});

resetCase("emily");
