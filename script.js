const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });
}

const scrollProgress = document.querySelector("[data-scroll-progress]");
const particleLayer = document.querySelector("[data-particles]");
const hero = document.querySelector(".hero");
const heroDumbbell = document.querySelector(".hero-dumbbell");
const systemStage = document.querySelector(".system-stage");
const contactSection = document.querySelector("#contact");

if (particleLayer) {
  const particleCount = window.matchMedia("(max-width: 640px)").matches ? 18 : 36;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${20 + Math.random() * 90}%`;
    particle.style.setProperty("--size", `${1 + Math.random() * 3}px`);
    particle.style.setProperty("--alpha", `${0.18 + Math.random() * 0.48}`);
    particle.style.setProperty("--duration", `${7 + Math.random() * 12}s`);
    particle.style.setProperty("--delay", `${Math.random() * -12}s`);
    particle.style.setProperty("--drift-x", `${-50 + Math.random() * 100}px`);
    fragment.appendChild(particle);
  }

  particleLayer.appendChild(fragment);
}

if (hero && heroDumbbell && systemStage && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroDumbbell.style.setProperty("--px", `${x * 18}px`);
    heroDumbbell.style.setProperty("--py", `${y * 14}px`);
    systemStage.style.setProperty("--stage-x", `${x * 7}px`);
    systemStage.style.setProperty("--stage-y", `${y * 5}px`);
    hero.style.setProperty("--hero-spot-x", `${76 + x * 8}%`);
    hero.style.setProperty("--hero-spot-y", `${30 + y * 6}%`);
  });

  hero.addEventListener("pointerleave", () => {
    heroDumbbell.style.setProperty("--px", "0px");
    heroDumbbell.style.setProperty("--py", "0px");
    systemStage.style.setProperty("--stage-x", "0px");
    systemStage.style.setProperty("--stage-y", "0px");
    hero.style.setProperty("--hero-spot-x", "78%");
    hero.style.setProperty("--hero-spot-y", "30%");
  });
}

const setScrolledState = () => {
  document.body.classList.toggle("has-scrolled", window.scrollY > 420);
  if (scrollProgress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
};

setScrolledState();
window.addEventListener("scroll", setScrolledState, { passive: true });

if (contactSection && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(
    ([entry]) => {
      document.body.classList.toggle("is-contact-visible", entry.isIntersecting);
    },
    { threshold: 0.35 },
  );

  contactObserver.observe(contactSection);
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const pathData = {
  home: {
    kicker: "Best first move",
    title: "Home training audit",
    copy:
      "Send your equipment, current exercises, weekly schedule, and photos if comfortable. I will tell you how to structure the first 14 days.",
    items: ["Workout split check", "Progression rule", "Food baseline"],
    text:
      "Hi Nikhil, I want my 14-day food + training starter plan. I train at home. Can you review my routine?",
  },
  gym: {
    kicker: "Best first move",
    title: "Gym blueprint setup",
    copy:
      "Send your gym access, current split, weak body parts, and training days. I will help you set up a cleaner weekly blueprint.",
    items: ["Push/pull/legs", "Exercise order", "Progress tracking"],
    text:
      "Hi Nikhil, I want my 14-day food + training starter plan. I train at the gym. Can you review my current routine?",
  },
  fatloss: {
    kicker: "Best first move",
    title: "Fat-loss starter plan",
    copy:
      "Send your waist, weight, food routine, snack habits, and activity level. The first move is usually portion control, not starvation.",
    items: ["Rice control", "Protein structure", "14-day waist check"],
    text:
      "Hi Nikhil, I want my 14-day food + training starter plan. My goal is fat loss. Can you review my food routine?",
  },
  muscle: {
    kicker: "Best first move",
    title: "Lean muscle structure",
    copy:
      "Send your bodyweight, training age, current meals, and lifts/exercises. We set protein, progression, and a realistic weight-gain pace.",
    items: ["Protein target", "Training volume", "Weight trend"],
    text:
      "Hi Nikhil, I want my 14-day food + training starter plan. My goal is lean muscle gain. Can you help me set my structure?",
  },
  diet: {
    kicker: "Best first move",
    title: "Food routine reset",
    copy:
      "Send one normal day of eating, including tea, snacks, ghee/oil, and late-night food. We clean the routine before adding complexity.",
    items: ["Meal timing", "Hidden calories", "Simple rules"],
    text:
      "Hi Nikhil, I want my 14-day food + training starter plan. My food routine is inconsistent. Can you review one normal day of eating?",
  },
};

const pathButtons = document.querySelectorAll("[data-path]");
const pathKicker = document.querySelector("[data-path-kicker]");
const pathTitle = document.querySelector("[data-path-title]");
const pathCopy = document.querySelector("[data-path-copy]");
const pathList = document.querySelector("[data-path-list]");
const pathLink = document.querySelector("[data-path-link]");
const pathResult = document.querySelector(".path-result");

const updatePath = (key) => {
  const data = pathData[key] || pathData.home;
  pathButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.path === key));
  if (pathKicker) pathKicker.textContent = data.kicker;
  if (pathTitle) pathTitle.textContent = data.title;
  if (pathCopy) pathCopy.textContent = data.copy;
  if (pathList) pathList.innerHTML = data.items.map((item) => `<li>${item}</li>`).join("");
  if (pathLink) {
    pathLink.href = `https://wa.me/9779829721606?text=${encodeURIComponent(data.text)}`;
  }
  if (pathResult) {
    pathResult.classList.remove("is-activating");
    window.requestAnimationFrame(() => {
      pathResult.classList.add("is-activating");
      window.setTimeout(() => pathResult.classList.remove("is-activating"), 760);
    });
  }
};

pathButtons.forEach((button) => {
  button.addEventListener("click", () => updatePath(button.dataset.path));
});

const counters = document.querySelectorAll("[data-count-to]");

const runCounter = (counter) => {
  const target = Number(counter.dataset.countTo || 0);
  const prefix = counter.dataset.countPrefix || "";
  const suffix = counter.dataset.countSuffix || "";
  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    counter.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(runCounter);
}
