document.addEventListener("DOMContentLoaded", () => {
  // Initialize the age gate first
  initAgeGate();
  // Initialize theme toggle so it works on the age gate too
  initThemeToggle();
});

// === Age Verification Gate ===
function initAgeGate() {
  populateDOBSelectors("gateDay", "gateMonth", "gateYear");
  document.getElementById("verifyAgeBtn").addEventListener("click", handleAgeVerification);
}

function handleAgeVerification() {
  const day = document.getElementById("gateDay").value;
  const month = document.getElementById("gateMonth").value;
  const year = document.getElementById("gateYear").value;
  const errorEl = document.getElementById("ageGateError");

  if (!day || !month || !year) {
    errorEl.textContent = "Please select a valid date.";
    return;
  }
  errorEl.textContent = "";

  const age = calculateDetailedAge(year, month, day);

  if (age.years < 18) {
    showAccessDenied();
  } else {
    document.getElementById("ageGateOverlay").style.display = "none";
    document.getElementById("appWrapper").style.display = "block";

    displayAgeInApp(age);
    initializeAppFunctions();
  }
}

function showAccessDenied() {
  document.body.innerHTML = `
    <div class="age-gate-overlay" style="display: flex;">
      <div class="age-gate-content">
        <h1 style="font-size: 36px; color: #e53e3e;">Access Denied</h1>
        <p style="font-size: 18px; margin: 20px 0;">You must be 18 or older to use this site.</p>
        <p>You will be redirected shortly.</p>
      </div>
    </div>
  `;
  setTimeout(() => {
    window.location.href = "https://www.google.com";
  }, 3000);
}

// === Initialize Main App after Verification ===
function initializeAppFunctions() {
  detectIPAndLocation();
  loadCountries();
  document.getElementById("resetBtn").addEventListener("click", () => {
    location.reload();
  });
}

// === Theme Toggle ===
function initThemeToggle() {
  const toggle = document.getElementById("modeToggle");
  if (toggle) {
    toggle.onclick = () => {
      document.body.classList.toggle("dark-mode");
      const isDarkMode = document.body.classList.contains("dark-mode");
      toggle.innerHTML = isDarkMode
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
    };
  }
}

// === IP & Location Info ===
function detectIPAndLocation() {
  fetch("https://ipinfo.io/json?token=358d62440491a6")
    .then(res => res.json())
    .then(data => {
      document.getElementById("ipAddress").textContent = data.ip || "Unavailable";
      document.getElementById("userLocation").textContent = `${data.country || ''}, ${data.city || 'Unknown'}`;
    })
    .catch(() => {
      document.getElementById("ipAddress").textContent = "Error";
      document.getElementById("userLocation").textContent = "Error";
    });
}

// === DOB Dropdown Logic ===
function populateDOBSelectors(dayId, monthId, yearId) {
  const daySelect = document.getElementById(dayId);
  const monthSelect = document.getElementById(monthId);
  const yearSelect = document.getElementById(yearId);

  for (let d = 1; d <= 31; d++) {
    daySelect.innerHTML += `<option value="${d}">${d}</option>`;
  }

  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ].forEach((m, i) => {
    monthSelect.innerHTML += `<option value="${i + 1}">${m}</option>`;
  });

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }
}

// === Detailed Age Calculation ===
function calculateDetailedAge(year, month, day) {
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function displayAgeInApp(age) {
  const display = document.getElementById("ageDisplay");
  display.innerHTML = `
    <div class="age-part">
      <span>${age.years}</span>
      Years
    </div>
    <div class="age-part">
      <span>${age.months}</span>
      Months
    </div>
    <div class="age-part">
      <span>${age.days}</span>
      Days
    </div>
  `;
}
function loadCountries() {
  const input = document.getElementById("countrySearch");
  const infoBox = document.getElementById("countryInfo");
  const flagImg = document.getElementById("countryFlag");
  const displayBox = document.getElementById("countryDisplay");

  let countriesData = [];
  let lastCountry = null;

  fetch("https://restcountries.com/v3.1/all?fields=name,population,region,flags")
    .then(res => res.json())
    .then(data => {
      countriesData = data;

      // === Set Pakistan by default ===
      const defaultCountry = countriesData.find(c =>
        c.name.common.toLowerCase() === "pakistan"
      );
      if (defaultCountry) {
        lastCountry = defaultCountry.name.common;
        input.value = lastCountry;
        displayBox.style.display = "block";
        infoBox.innerHTML = `
          <p><strong><i class="fas fa-globe"></i> Country:</strong> ${defaultCountry.name.common}</p>
          <p><strong><i class="fas fa-users"></i> Population:</strong> ${defaultCountry.population.toLocaleString()}</p>
          <p><strong><i class="fas fa-compass"></i> Region:</strong> ${defaultCountry.region}</p>
        `;
        flagImg.src = defaultCountry.flags.png;
        flagImg.alt = `Flag of ${defaultCountry.name.common}`;
        flagImg.style.display = "block";
      }

      // === Enter key press to search country ===
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const search = input.value.trim().toLowerCase();
          const matched = countriesData.find(c =>
            c.name.common.toLowerCase() === search
          );

          if (!matched) {
            displayBox.style.display = "block";
            infoBox.innerHTML = "<p style='color:red;'>No country found matching your search.</p>";
            flagImg.style.display = "none";
            return;
          }

          if (lastCountry && matched.name.common !== lastCountry) {
            const confirmed = confirm("Are you sure to change the country?");
            if (!confirmed) {
              input.value = lastCountry;
              return;
            }
          }

          lastCountry = matched.name.common;
          displayBox.style.display = "block";
          infoBox.innerHTML = `
            <p><strong><i class="fas fa-globe"></i> Country:</strong> ${matched.name.common}</p>
            <p><strong><i class="fas fa-users"></i> Population:</strong> ${matched.population.toLocaleString()}</p>
            <p><strong><i class="fas fa-compass"></i> Region:</strong> ${matched.region}</p>
          `;
          flagImg.src = matched.flags.png;
          flagImg.alt = `Flag of ${matched.name.common}`;
          flagImg.style.display = "block";
        }
      });
    })
    .catch(() => {
      displayBox.style.display = "block";
      infoBox.innerHTML = "<p style='color:red;'>Failed to load country data. Please try again later.</p>";
      flagImg.style.display = "none";
    });
}
