// Interaccion suave: tabs activas y barras de habilidades animadas
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll("main section");
const skillBars = document.querySelectorAll(".skill__bar");

const setActiveTab = (id) => {
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.target === id);
  });
};

// Scroll a la seccion cuando se pulsa una pestaña
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.getElementById(tab.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Observer para activar pestañas segun el scroll
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveTab(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -40% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// Animar niveles de habilidades cuando entran en pantalla
const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        entry.target.style.setProperty("--level", `${level}%`);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

skillBars.forEach((bar) => skillObserver.observe(bar));
