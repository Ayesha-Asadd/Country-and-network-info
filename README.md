# 🌐 Interactive UX Web App: Age & Location-Based Personalization

A browser-based JavaScript application that delivers personalized and dynamic user experiences based on real-time IP geolocation and age verification.

## 🚀 Features

**📍 IP & Location Detection**

   Integrated with [IPInfo.io API](https://ipinfo.io/) to automatically detect and store the user's IP address and country.
   Country data is saved in `localStorage` for persistence across sessions.

**🎂 Age Verification System**

   Custom modal for Date of Birth input.
   Calculates precise age (years, months, days).
   Restricts access for users under 18.

**🌍 Dynamic Country Info Panel**

  Searchable dropdown using [REST Countries API](https://restcountries.com/).
  Displays country flag, region, and population.

**🌓 Dark/Light Mode Toggle**

  Toggle switch for accessibility and theme preference.
  User preference saved and reapplied via `localStorage`.

**💾 Persistent User Experience**

  Saves country selection, theme, and user data in `localStorage`.
  Auto-fills preferences on page reload.

**📱 Mobile-Responsive + Smooth UI**

 Fully responsive design with animated UI transitions and modals.

**🔁 Reset Functionality**

  Clear all stored user data and refresh app state with one click.

## 🧰 Tech Stack

 **Languages:** JavaScript, HTML, CSS
 **APIs:** IPInfo.io, REST Countries
 **Storage:** localStorage
 **UX:** Responsive layout, animations, accessibility features

## 🛠️ Setup Instructions

1. Clone the repository
2. Create a `.env` file with your IPInfo API Key
3. Open `index.html` in your browser

## ✍️ Author

Developed by Ayesha Mukhtar Asad
Skills: JavaScript · REST APIs · HTML · CSS
