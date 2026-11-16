/* FOXFall website behavior:
   - GitHub Releases integration (real download button, version display)
   - falling autumn leaves (respects prefers-reduced-motion)
   - responsive nav, reveal-on-scroll
*/
(function () {
  "use strict";

  var APP_REPO = "phantomguy282-dev/FOXFall";

  /* ---------------- year ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- nav ---------------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.classList.remove("open");
      }
    });
  }

  /* ---------------- reveal on scroll ---------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- falling leaves ---------------- */
  var LEAF_GLYPHS = ["🍂", "🍁", "🍃"];
  var leavesHost = document.getElementById("leaves");
  if (leavesHost && !reduced) {
    var count = window.innerWidth < 700 ? 8 : 14;
    for (var i = 0; i < count; i++) {
      var leaf = document.createElement("span");
      leaf.className = "leaf";
      leaf.textContent = LEAF_GLYPHS[i % LEAF_GLYPHS.length];
      leaf.style.left = (Math.random() * 100) + "vw";
      leaf.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      var dur = 9 + Math.random() * 10;
      leaf.style.animationDuration = dur + "s";
      leaf.style.animationDelay = (-Math.random() * dur) + "s";
      leaf.style.fontSize = (13 + Math.random() * 14) + "px";
      leavesHost.appendChild(leaf);
    }
  }

  /* ---------------- GitHub Releases ---------------- */
  function formatSize(bytes) {
    if (!bytes) return "";
    var units = ["B", "KB", "MB", "GB"];
    var u = 0, n = bytes;
    while (n >= 1024 && u < units.length - 1) { n /= 1024; u++; }
    return n.toFixed(1) + " " + units[u];
  }

  function setDownloadState(message, isError) {
    var el = document.getElementById("dlState");
    if (el) {
      el.textContent = message;
      el.style.color = isError ? "#FF6666" : "#FFB347";
    }
  }

  function applyRelease(release) {
    var version = (release.tag_name || "").replace(/^v/, "");
    var versionEl = document.getElementById("dlVersion");
    if (versionEl) versionEl.textContent = "FOXFall v" + version;

    var notes = document.getElementById("dlNotes");
    if (notes) notes.href = release.html_url || ("https://github.com/" + APP_REPO + "/releases");

    var button = document.getElementById("dlButton");
    var heroBtn = document.getElementById("heroDownload");

    // Prefer the installer, then the portable build; else the release page.
    var assets = release.assets || [];
    var exe = assets.find(function (a) {
      return /foxfall-setup.*\.exe$/i.test(a.name);
    }) || assets.find(function (a) { return /foxfall-portable.*\.exe$/i.test(a.name); }) || assets.find(function (a) { return /\.exe$/i.test(a.name); });

    if (exe && exe.browser_download_url) {
      if (button) {
        button.href = exe.browser_download_url;
        button.textContent = "DOWNLOAD FOXFALL " + (exe.size ? "(" + formatSize(exe.size) + ")" : "");
      }
      if (heroBtn) heroBtn.href = exe.browser_download_url;
      setDownloadState("Latest release: " + (release.name || release.tag_name));
    } else {
      // No exe asset yet: don't fake a download link.
      if (button) {
        button.href = release.html_url || ("https://github.com/" + APP_REPO + "/releases");
        button.textContent = "VIEW RELEASES ON GITHUB";
      }
      if (heroBtn) heroBtn.href = "https://github.com/" + APP_REPO + "/releases";
      setDownloadState("No downloadable build attached yet — see releases on GitHub.", true);
    }
  }

  function showComingSoon() {
    var versionEl = document.getElementById("dlVersion");
    if (versionEl) versionEl.textContent = "Coming soon";
    var button = document.getElementById("dlButton");
    if (button) {
      button.href = "https://github.com/" + APP_REPO + "/releases";
      button.textContent = "VIEW RELEASES ON GITHUB";
    }
    var heroBtn = document.getElementById("heroDownload");
    if (heroBtn) heroBtn.href = "https://github.com/" + APP_REPO + "/releases";
    setDownloadState("No release published yet. Watch the repository for the first build.", true);
  }

  fetch("https://api.github.com/repos/" + APP_REPO + "/releases/latest")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(applyRelease)
    .catch(function () { showComingSoon(); });
})();