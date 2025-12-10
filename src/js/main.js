document.addEventListener("DOMContentLoaded", () => {
  initToggles(); // щоб працювали стрілочки з ЛР4
  loadData();    // тягнемо все з data.json
});

function loadData() {
  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Не вдалося завантажити data.json");
      return response.json();
    })
    .then((data) => {
      applyPerson(data.person);
      renderSkills(data.skills);
      renderExperience(data.jobs);
    })
    .catch((error) => {
      console.error("Помилка:", error);
    });
}

// 🔹 ПІБ + роль + фото з JSON
function applyPerson(person) {
  if (!person) return;

  const firstEl = document.getElementById("personFirstName");
  const lastEl = document.getElementById("personLastName");
  const roleEl = document.getElementById("personRole");
  const photoEl = document.querySelector(".cv-header__photo");

  if (firstEl) {
    firstEl.textContent = person.firstName || "";
  }

  if (lastEl) {
    lastEl.textContent = person.lastName || "";
  }

  if (roleEl && person.role) {
    roleEl.textContent = person.role;
  }

  if (photoEl && person.photo) {
    photoEl.src = person.photo;
    photoEl.alt = `${person.firstName || ""} ${person.lastName || ""}`.trim();
    // Додаємо обробку помилок завантаження зображення
    photoEl.onerror = function() {
      console.error('Помилка завантаження фото:', person.photo);
      console.error('Поточний src:', this.src);
      console.error('Base URL:', window.location.href);
    };
    photoEl.onload = function() {
      console.log('Фото успішно завантажено:', person.photo);
    };
  } else {
    console.warn('Photo element not found or photo path missing:', { photoEl, photo: person?.photo });
  }

}

function renderSkills(skills) {
  const list = document.getElementById("skillsList");
  if (!list || !Array.isArray(skills)) return;

  list.innerHTML = skills
    .map(
      (skill) => `
      <li class="cv-skill">
        <div class="cv-skill__circle">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="50"></circle>
            <circle
              class="progress-border"
              cx="60" cy="60" r="50"
              style="stroke-dasharray: 314;
                     stroke-dashoffset: ${314 - (skill.progress / 100) * 314};
                     transform: rotate(${skill.offset}deg);
                     transform-origin: 50% 50%;">
            </circle>
            <circle
              class="progress"
              cx="60" cy="60" r="50"
              style="stroke-dasharray: 314;
                     stroke-dashoffset: ${314 - (skill.progress / 100) * 314};
                     transform: rotate(${skill.offset}deg);
                     transform-origin: 50% 50%;">
            </circle>
          </svg>
          <span class="cv-skill__label">${skill.name}</span>
        </div>
      </li>`
    )
    .join("");
}

function renderExperience(jobs) {
  const list = document.getElementById("jobsList");
  if (!list || !Array.isArray(jobs)) return;

  list.innerHTML = jobs
    .map(
      (job) => `
      <div class="cv-experience__item">
        <h3>${job.position}</h3>
        <div class="cv-meta">
          <span class="cv-period">${job.period}</span>
          <span class="cv-company">${job.company}</span>
        </div>
        <p class="cv-description">
          ${job.description}
        </p>
      </div>
    `
    )
    .join("");
}



function initToggles() {
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const content = document.getElementById(targetId);
      if (!content) return;

      content.classList.toggle("is-hidden");

      const icon = btn.querySelector(".toggle-icon");
      if (icon) {
        icon.classList.toggle("rotated");
      }
    });
  });
}
