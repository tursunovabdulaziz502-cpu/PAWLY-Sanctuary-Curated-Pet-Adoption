document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".companion-card"));
  const searchInput = document.getElementById("searchInput");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const phaseFilter = document.getElementById("phaseFilter");
  const temperamentFilter = document.getElementById("temperamentFilter");
  const statusFilter = document.getElementById("statusFilter");
  const resetBtn = document.getElementById("resetBtn");
  const visibleCount = document.getElementById("visibleCount");
  const favButtons = document.querySelectorAll(".fav-btn");

  const headerSearch = document.querySelector(".search");
  const headerLike = document.querySelector(".like");
  const headerLikeIcon = headerLike ? headerLike.querySelector("i") : null;

  const navLinks = document.querySelectorAll(".a-links a");
  const adoptNowBtn = document.getElementById("adoptNow");
  const adoptNowHeroBtn = document.getElementById("adoptnow1");
  const adoptionProtocolBtn = document.getElementById("adoption");

  const modal = document.getElementById("pawlyModal");
  const modalClose = document.getElementById("modalClose");
  const modalBadge = document.getElementById("modalBadge");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalForm = document.getElementById("modalForm");

  let activeCategory = "all";
  let onlyFavorites = false;
  let savedLikes = JSON.parse(localStorage.getItem("pawly_likes") || "[]");

  const likeCounter = document.createElement("span");
  likeCounter.style.cssText = "font-size:11px;font-weight:700;margin-left:5px;color:#f43f5e;";
  if (headerLike) {
    headerLike.style.display = "flex";
    headerLike.style.alignItems = "center";
    headerLike.appendChild(likeCounter);
  }

  function updateLikeCounter() {
    likeCounter.textContent = savedLikes.length > 0 ? savedLikes.length : "";
  }

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent;
    const btn = card.querySelector(".fav-btn");
    if (savedLikes.includes(name)) {
      btn.classList.add("active");
      btn.innerHTML = "&#9829;";
    }
  });
  updateLikeCounter();

  function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const text = link.textContent.trim().toLowerCase();
      if (text === "home") {
        e.preventDefault();
        scrollToSection("#home");
      } else if (text === "adopt") {
        e.preventDefault();
        scrollToSection(".sanctuary-section");
      } else if (text === "how it works") {
        e.preventDefault();
        scrollToSection(".protocol-section");
      } else if (text === "stories") {
        e.preventDefault();
        scrollToSection(".chronicles-section");
      } else if (text === "about") {
        e.preventDefault();
        scrollToSection(".testimonials-section");
      } else if (text === "contact") {
        e.preventDefault();
        scrollToSection(".pawly-footer-section");
      }
    });
  });

  if (adoptNowBtn) {
    adoptNowBtn.addEventListener("click", () => scrollToSection(".sanctuary-section"));
  }

  if (adoptNowHeroBtn) {
    adoptNowHeroBtn.addEventListener("click", () => scrollToSection(".sanctuary-section"));
  }

  if (adoptionProtocolBtn) {
    adoptionProtocolBtn.addEventListener("click", () => scrollToSection(".protocol-section"));
  }

  function openModal(badge, title, desc, showForm) {
    modalBadge.textContent = badge;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalForm.style.display = showForm ? "flex" : "none";
    modal.classList.add("open");
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => modal.classList.remove("open"));
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });

  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      modalBadge.textContent = "CONFIRMED";
      modalTitle.textContent = "Request Received";
      modalDesc.textContent = "Our sanctuary concierge will contact you within 2 hours to arrange your private consultation.";
      modalForm.style.display = "none";
      modalForm.reset();
    });
  }

  document.querySelectorAll(".btn-adopt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".companion-card");
      const name = card.querySelector("h3").textContent;
      const breed = card.querySelector(".breed").textContent;
      openModal("ADOPTION INQUIRY", "Adopt " + name, breed + " — Complete your guardian intake request below.", true);
    });
  });

  document.querySelectorAll(".btn-dossier").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".companion-card");
      const name = card.querySelector("h3").textContent;
      const breed = card.querySelector(".breed").textContent;
      const meta = card.querySelector(".meta-info").innerText.replace(/\n/g, " | ");
      openModal("CLINICAL DOSSIER", name + " — Medical Profile", breed + " (" + meta + "). 60-point temperament evaluation passed, full orthopedic clearance and vaccination records verified.", false);
    });
  });

  document.querySelectorAll(".city-pill").forEach((pill) => {
    pill.style.cursor = "pointer";
    pill.addEventListener("click", () => {
      const city = pill.textContent.trim();
      openModal("GLOBAL SANCTUARY HUB", city + " Private Estate", "Schedule a private salon viewing or international courier briefing with our " + city + " veterinary director.", true);
    });
  });

  document.querySelectorAll(".pawly-link-col a, .legal-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const title = link.textContent.trim();
      openModal("PAWLY INTERNATIONAL", title, "Request full documentation or speak directly with our concierge team regarding " + title + ".", true);
    });
  });

  function animateCards() {
    let delay = 0;
    cards.forEach((card) => {
      if (card.style.display !== "none") {
        card.classList.remove("visible");
        setTimeout(() => {
          card.classList.add("visible");
        }, delay);
        delay += 40;
      }
    });
  }

  function filterCards() {
    const query = searchInput.value.toLowerCase().trim();
    const phase = phaseFilter.value;
    const temperament = temperamentFilter.value;
    const status = statusFilter.value;
    let count = 0;

    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      const cardCategory = card.dataset.category;
      const cardPhase = card.dataset.phase;
      const cardTemperament = card.dataset.temperament;
      const cardStatus = card.dataset.status;
      const isLiked = card.querySelector(".fav-btn").classList.contains("active");

      const matchQuery = text.includes(query);
      const matchCategory = activeCategory === "all" || cardCategory === activeCategory;
      const matchPhase = phase === "all" || cardPhase === phase;
      const matchTemperament = temperament === "all" || cardTemperament === temperament;
      const matchStatus = status === "all" || cardStatus === status;
      const matchFavorite = !onlyFavorites || isLiked;

      if (matchQuery && matchCategory && matchPhase && matchTemperament && matchStatus && matchFavorite) {
        card.style.display = "flex";
        count++;
      } else {
        card.style.display = "none";
      }
    });

    visibleCount.textContent = count;
    animateCards();
  }

  if (headerSearch) {
    headerSearch.addEventListener("click", () => {
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        searchInput.focus();
      }, 500);
    });
  }

  if (headerLike) {
    headerLike.addEventListener("click", () => {
      onlyFavorites = !onlyFavorites;

      if (onlyFavorites) {
        headerLikeIcon.classList.remove("fa-regular");
        headerLikeIcon.classList.add("fa-solid");
        headerLikeIcon.style.color = "#f43f5e";
        scrollToSection(".sanctuary-section");
      } else {
        headerLikeIcon.classList.remove("fa-solid");
        headerLikeIcon.classList.add("fa-regular");
        headerLikeIcon.style.color = "";
      }

      filterCards();
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      filterCards();
    });
  });

  searchInput.addEventListener("input", filterCards);
  phaseFilter.addEventListener("change", filterCards);
  temperamentFilter.addEventListener("change", filterCards);
  statusFilter.addEventListener("change", filterCards);

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    phaseFilter.value = "all";
    temperamentFilter.value = "all";
    statusFilter.value = "all";
    activeCategory = "all";
    onlyFavorites = false;

    if (headerLikeIcon) {
      headerLikeIcon.classList.remove("fa-solid");
      headerLikeIcon.classList.add("fa-regular");
      headerLikeIcon.style.color = "";
    }

    tabButtons.forEach((b) => b.classList.remove("active"));
    tabButtons[0].classList.add("active");

    filterCards();
  });

  favButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".companion-card");
      const name = card.querySelector("h3").textContent;
      const isNowActive = btn.classList.toggle("active");

      btn.innerHTML = isNowActive ? "&#9829;" : "&#9825;";

      if (isNowActive) {
        if (!savedLikes.includes(name)) savedLikes.push(name);
      } else {
        savedLikes = savedLikes.filter((item) => item !== name);
      }

      localStorage.setItem("pawly_likes", JSON.stringify(savedLikes));
      updateLikeCounter();

      if (onlyFavorites) {
        filterCards();
      }
    });
  });

  animateCards();

  const protocolCards = document.querySelectorAll(".protocol-card");
  const accordion = document.getElementById("checklistAccordion");
  const trigger = document.getElementById("accordionTrigger");
  const content = document.getElementById("accordionContent");

  protocolCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("visible");
    }, index * 110);
  });

  if (trigger) {
    trigger.addEventListener("click", () => {
      const isOpen = accordion.classList.toggle("open");
      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  }

  const chroniclesCard = document.getElementById("chroniclesCard");
  if (chroniclesCard) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(chroniclesCard);
  }
});