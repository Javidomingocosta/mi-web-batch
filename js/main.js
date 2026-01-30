(() => {
  // Marca el link activo
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navlinks a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) {
      a.style.color = "rgba(255,255,255,.92)";
      a.style.background = "rgba(255,255,255,.07)";
      a.style.borderColor = "rgba(140,180,255,.22)";
    }
  });

  // Año en footer
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
