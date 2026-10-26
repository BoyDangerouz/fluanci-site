/* =========================================================
   Fluanci site behaviour
   ========================================================= */

/* ---- Form delivery -------------------------------------------------------
   Until a form service is connected, forms open the visitor's email app with
   a pre-filled message to hello@fluanci.com.
   To collect submissions directly, create a free form at formspree.io (or a
   similar service) and paste its endpoints below, e.g.
   "https://formspree.io/f/abcdwxyz".
--------------------------------------------------------------------------- */
const FORM_ENDPOINTS = {
  waitlist: "",
  contact: "",
};
const CONTACT_EMAIL = "hello@fluanci.com";

/* ---- Theme toggle ---- */
(function () {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  const sync = () => {
    const dark = root.dataset.theme === "dark";
    buttons.forEach((b) => {
      b.setAttribute("aria-pressed", String(dark));
      b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    });
  };
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("fluanci-theme", next); } catch (e) { /* storage unavailable */ }
      sync();
    })
  );
  sync();
})();

/* ---- Mobile menu (accessible drawer) ---- */
(function () {
  const openBtn = document.querySelector("[data-menu-open]");
  const drawer = document.getElementById("mobile-menu");
  if (!openBtn || !drawer) return;
  const closeBtn = drawer.querySelector("[data-menu-close]");
  const focusables = () => drawer.querySelectorAll("a, button");

  const open = () => {
    drawer.classList.add("is-open");
    drawer.removeAttribute("inert");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtn && closeBtn.focus(), 50);
  };
  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    openBtn.focus();
  };

  openBtn.addEventListener("click", open);
  closeBtn && closeBtn.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    document.body.style.overflow = "";
  }));
  drawer.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const items = Array.from(focusables());
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ---- Decorative waveform (static by default, slow pulse if motion allowed) ---- */
(function () {
  const heights = [8, 12, 20, 14, 10, 24, 30, 18, 12, 22, 32, 20, 14, 10, 18, 26, 16, 12, 22, 14, 8];
  document.querySelectorAll("[data-wave]").forEach((wave) => {
    wave.innerHTML = heights.map((h, i) => `<i style="--h:${h};--d:${i}"></i>`).join("");
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!saveData) wave.classList.add("is-animated");
  });
})();

/* ---- Footer year ---- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---- Forms ---- */
(function () {
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  const setError = (field, message) => {
    const input = field.querySelector("input, select, textarea");
    const err = field.querySelector(".field-error");
    if (!input || !err) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      err.querySelector("span").textContent = message;
      err.classList.add("is-visible");
    } else {
      input.removeAttribute("aria-invalid");
      err.classList.remove("is-visible");
    }
  };

  const showStatus = (form, type, message) => {
    const box = form.querySelector(".form-status");
    if (!box) return;
    box.className = `form-status ${type} is-visible`;
    box.querySelector("span").textContent = message;
  };

  const validate = (form) => {
    let firstBad = null;
    form.querySelectorAll(".field").forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      if (!input) return;
      let msg = "";
      const val = (input.value || "").trim();
      if (input.required && !val) msg = field.dataset.requiredMsg || "This field is required.";
      else if (input.type === "email" && val && !emailOk(val)) msg = "Enter an email address like name@example.com.";
      else if (input.tagName === "TEXTAREA" && input.required && val.length < 10) msg = "Add a little more detail (at least 10 characters).";
      setError(field, msg);
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  };

  const mailtoFor = (kind, data) => {
    if (kind === "waitlist") {
      const subject = "Join the Fluanci waitlist";
      const body = `Please add me to the Fluanci waitlist.\n\nEmail: ${data.email}\n\nI understand Fluanci will only use this address to send updates about Lerato, and I can ask to be removed at any time.`;
      return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    const subject = `[${data.subject || "General"}] Message from ${data.name}`;
    const body = `${data.message}\n\n—\n${data.name}\n${data.email}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  document.querySelectorAll("form[data-form]").forEach((form) => {
    const kind = form.dataset.form;
    form.setAttribute("novalidate", "");

    form.querySelectorAll("input, select, textarea").forEach((input) =>
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") setError(input.closest(".field"), "");
      })
    );

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate(form)) {
        showStatus(form, "error", "Check the highlighted field and try again.");
        return;
      }
      const data = Object.fromEntries(new FormData(form).entries());
      if (data._gotcha) return; // spam honeypot
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.querySelector("span");
      const original = label.textContent;

      const endpoint = FORM_ENDPOINTS[kind];
      if (!endpoint) {
        window.location.href = mailtoFor(kind, data);
        showStatus(form, "success",
          kind === "waitlist"
            ? "Your email app should open with a ready-to-send message. Press send and you're on the list."
            : "Your email app should open with your message ready. Press send to reach us.");
        return;
      }

      btn.disabled = true;
      label.textContent = kind === "waitlist" ? "Joining…" : "Sending…";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        showStatus(form, "success",
          kind === "waitlist"
            ? "You're on the list. We'll email you when there's real news about Lerato."
            : "Message sent. Thank you for reaching out.");
      } catch (err) {
        showStatus(form, "error", `That didn't go through. Try again, or email ${CONTACT_EMAIL} directly.`);
      } finally {
        btn.disabled = false;
        label.textContent = original;
      }
    });
  });
})();
