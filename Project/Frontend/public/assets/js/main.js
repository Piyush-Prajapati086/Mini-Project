document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const openSidebarBtn = document.getElementById("open-sidebar");
  const closeSidebarBtn = document.getElementById("close-sidebar");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const contentBlocks = document.querySelectorAll(".content-block");
  const locationInput = document.getElementById("location");

  // -------------------------
  // Map Logic
  // -------------------------
  let map;
  const initializeMap = () => {
    if (map) map.remove();
    map = L.map("map").setView([28.6139, 77.209], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const issues = [
      { lat: 28.618, lng: 77.215, type: "pothole", status: "pending" },
      { lat: 28.625, lng: 77.2, type: "garbage", status: "resolved" },
    ];

    issues.forEach((issue) => {
      const color =
        issue.status === "resolved"
          ? "green"
          : issue.status === "pending"
          ? "red"
          : "orange";
      L.circleMarker([issue.lat, issue.lng], {
        radius: 8,
        color: color,
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup(`${issue.type} <br>Status: ${issue.status}`);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        locationInput.value = `Auto-detected: Lat: ${latitude.toFixed(
          4
        )}, Lng: ${longitude.toFixed(4)}`;
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("Your Location")
          .openPopup();
        map.setView([latitude, longitude], 13);
      });
    }
  };

  initializeMap();

  // -------------------------
  // Sidebar Logic
  // -------------------------
  openSidebarBtn.addEventListener("click", () => sidebar.classList.add("open"));
  closeSidebarBtn.addEventListener("click", () =>
    sidebar.classList.remove("open")
  );

  sidebarLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const contentId = link.dataset.content;
      contentBlocks.forEach((block) => block.classList.add("hidden"));
      const target = document.getElementById(`${contentId}-content`);
      if (target) target.classList.remove("hidden");
      sidebar.classList.remove("open");
    })
  );

  // -------------------------
  // Quick Report Form
  // -------------------------
  document.getElementById("report-form").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Quick report submitted! (Firestore integration pending)");
  });
});

// Load sidebar.html dynamically
fetch("resources/layout/sidebar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("sidebar").innerHTML = html;
  });

// Load header.html dynamically
fetch("resources/layout/header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header").innerHTML = html;
  });


