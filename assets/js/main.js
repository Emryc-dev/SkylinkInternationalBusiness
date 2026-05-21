const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCopy = document.querySelector("[data-modal-copy]");
const modalClose = document.querySelector("[data-modal-close]");

const setHeaderState = () => {
  const y = window.scrollY;
  document.documentElement.style.setProperty("--scroll", y);
  header.classList.toggle("scrolled", y > 40);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.42 }
);

sections.forEach((section) => activeObserver.observe(section));

const processBoard = document.querySelector(".process-board");
const processLine = document.querySelector(".process-line");

const updateProcessProgress = () => {
  if (!processBoard || !processLine) return;
  const rect = processBoard.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport * 0.82)));
  processLine.style.setProperty("--progress", progress.toFixed(3));
};

updateProcessProgress();
window.addEventListener("scroll", updateProcessProgress, { passive: true });
window.addEventListener("resize", updateProcessProgress);

const form = document.querySelector("[data-quote-form]");
const fileInput = form?.querySelector('input[type="file"]');
const fileName = document.querySelector("[data-file-name]");

fileInput?.addEventListener("change", () => {
  fileName.textContent = fileInput.files?.[0]?.name || "No file selected";
});

const openModal = (title, copy) => {
  modalTitle.textContent = title;
  modalCopy.textContent = copy;
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    alert(`${title}\n${copy}`);
  }
};

modalClose.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const file = fileInput.files?.[0]?.name || "No file attached";
  const message = [
    "Hello SkyLink International Business, I need a quote.",
    `Name: ${data.get("name")}`,
    `WhatsApp: ${data.get("phone")}`,
    `Service: ${data.get("service")}`,
    `Details: ${data.get("details")}`,
    `Reference file: ${file}`,
  ].join("\n");

  openModal(
    "Request prepared",
    "Your request has been prepared for WhatsApp. A new tab will open so you can send it directly to SkyLink."
  );

  window.open(`https://wa.me/8618217557600?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  form.reset();
  fileName.textContent = "No file selected";
});

const testimonials = [...document.querySelectorAll(".testimonial")];
const nextBtn = document.querySelector("[data-carousel-next]");
const prevBtn = document.querySelector("[data-carousel-prev]");
let currentTestimonial = 0;
let carouselTimer;

const showTestimonial = (index) => {
  currentTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === currentTestimonial);
  });
};

const startCarousel = () => {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => showTestimonial(currentTestimonial + 1), 6500);
};

nextBtn?.addEventListener("click", () => {
  showTestimonial(currentTestimonial + 1);
  startCarousel();
});

prevBtn?.addEventListener("click", () => {
  showTestimonial(currentTestimonial - 1);
  startCarousel();
});

testimonials.forEach((testimonial) => {
  testimonial.addEventListener("click", () => {
    const quote = testimonial.querySelector("p")?.textContent || "Client feedback";
    const person = testimonial.querySelector("strong")?.textContent || "SkyLink client";
    openModal(person, quote);
  });
});

startCarousel();

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
