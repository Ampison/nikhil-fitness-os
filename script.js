document.documentElement.classList.add("js-enabled");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const navigationLinks = navigation ? [...navigation.querySelectorAll("a[href^='#']")] : [];

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navigation.classList.contains("is-open")) return;
    if (navigation.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 760) closeMenu();
  });
}

const navigationTargets = navigationLinks
  .map((link) => ({ link, target: document.querySelector(link.hash) }))
  .filter((item) => item.target);
let navigationFrame = 0;

function updateActiveNavigation() {
  const marker = window.scrollY + window.innerHeight * 0.28;
  let activeTarget = null;

  navigationTargets.forEach((item) => {
    if (item.target.offsetTop <= marker) activeTarget = item;
  });

  navigationTargets.forEach((item) => {
    const isActive = item === activeTarget;
    item.link.classList.toggle("is-active", isActive);
    if (isActive) item.link.setAttribute("aria-current", "location");
    else item.link.removeAttribute("aria-current");
  });
}

function queueActiveNavigationUpdate() {
  cancelAnimationFrame(navigationFrame);
  navigationFrame = requestAnimationFrame(updateActiveNavigation);
}

if (navigationTargets.length) {
  updateActiveNavigation();
  window.addEventListener("scroll", queueActiveNavigationUpdate, { passive: true });
  window.addEventListener("resize", queueActiveNavigationUpdate);
}

const revealItems = [...document.querySelectorAll("[data-reveal]")];

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4%" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const artifactTabs = [...document.querySelectorAll("[data-artifact-tab]")];
const artifactPanels = [...document.querySelectorAll("[data-artifact-panel]")];

function selectArtifact(tab) {
  const target = tab.dataset.artifactTab;

  artifactTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  artifactPanels.forEach((panel) => {
    const isActive = panel.dataset.artifactPanel === target;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

}

artifactTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectArtifact(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % artifactTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + artifactTabs.length) % artifactTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = artifactTabs.length - 1;

    selectArtifact(artifactTabs[nextIndex]);
    artifactTabs[nextIndex].focus();
  });
});

const planDialog = document.querySelector("[data-plan-dialog]");
const planDialogImage = document.querySelector("[data-plan-dialog-image]");
const planClose = document.querySelector("[data-plan-close]");
const planOpeners = [...document.querySelectorAll("[data-plan-open]")];
let activePlanOpener = null;

function closePlanDialog() {
  if (!planDialog?.open) return;
  planDialog.close();
}

if (planDialog && planDialogImage) {
  planOpeners.forEach((opener) => {
    opener.addEventListener("click", () => {
      activePlanOpener = opener;
      planDialogImage.src = opener.dataset.planOpen;
      planDialogImage.alt = opener.querySelector("img")?.alt || "Expanded real plan page";
      planDialog.classList.toggle("is-landscape", opener.dataset.planOpen.includes("plan-gym"));
      planDialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });

  planClose?.addEventListener("click", closePlanDialog);

  planDialog.addEventListener("click", (event) => {
    if (event.target === planDialog) closePlanDialog();
  });

  planDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    activePlanOpener?.focus();
  });
}

const heroStage = document.querySelector("[data-hero-stage]");

if (heroStage && finePointer && !prefersReducedMotion) {
  let frame = 0;

  heroStage.addEventListener("pointermove", (event) => {
    const bounds = heroStage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      heroStage.style.setProperty("--stage-x", `${x.toFixed(2)}px`);
      heroStage.style.setProperty("--stage-y", `${y.toFixed(2)}px`);
    });
  });

  heroStage.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    heroStage.style.setProperty("--stage-x", "0px");
    heroStage.style.setProperty("--stage-y", "0px");
  });
}
