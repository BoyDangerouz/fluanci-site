/* Fluanci site behaviour
   Forms: see README, "Forms".
   Both the waitlist and the contact form use one Web3Forms access key.
   The key is public by design (it only identifies the form).
   If the browser cannot reach Web3Forms, submit opens the visitor's email app.
*/
const FORM_ACCESS_KEY = "01a0cd92-014f-4ebf-a07c-8461abdadb66";
const FORM_ENDPOINT = "https://api.web3forms.com/submit";
const CONTACT_EMAIL = "hello@fluanci.com";

function configuredFormKey() {
  const key = String(FORM_ACCESS_KEY || "").trim();
  if (!key) return "";
  if (/^(your[_\s-]?|paste|changeme|xxxx|todo|replace)/i.test(key)) return "";
  return key;
}

/* Theme */
(function () {
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  const themeMeta = document.getElementById("theme-color");
  const sync = () => {
    const dark = root.dataset.theme === "dark";
    buttons.forEach((b) => {
      b.setAttribute("aria-pressed", String(dark));
      b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    });
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#090909" : "#f7f7f5");
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

/* Mobile menu */
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
  const close = (returnFocus) => {
    const wasOpen = drawer.classList.contains("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (wasOpen && returnFocus) openBtn.focus();
  };

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", () => close(true));
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => close(false)));
  drawer.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { close(true); return; }
    if (e.key !== "Tab") return;
    const items = Array.from(focusables());
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  const desktop = window.matchMedia("(min-width: 980px)");
  const onDesktop = () => { if (desktop.matches) close(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);
  else if (desktop.addListener) desktop.addListener(onDesktop);
})();

/* Waveform bars. Static when the visitor prefers less motion or data. */
(function () {
  const pattern = [10, 18, 28, 16, 12, 34, 48, 26, 14, 36, 52, 22, 16, 12, 30, 44, 20, 14, 32, 18, 10, 24, 40, 22, 12, 28, 16, 8];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  document.querySelectorAll("[data-wave]").forEach((wave) => {
    const wide = wave.dataset.wave === "wide" && window.innerWidth >= 720;
    const heights = wide ? pattern.concat(pattern) : pattern;
    wave.innerHTML = heights.map((h, i) => `<span class="bar" style="--h:${h};--d:${i}"></span>`).join("");
    if (!reduce && !saveData) wave.classList.add("is-animated");
  });
})();

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

/* Forms */
(function () {
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  const setError = (field, message) => {
    const input = field.querySelector("input, select, textarea");
    const err = field.querySelector(".field-error");
    if (!input || !err) return;
    const slot = err.querySelector("span");
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (slot) slot.textContent = message;
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
    const slot = box.querySelector("span");
    if (slot) slot.textContent = message;
  };

  const validate = (form) => {
    let firstBad = null;
    form.querySelectorAll(".field").forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      if (!input || input.type === "hidden") return;
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

  const payloadFor = (kind, data, key) => {
    const payload = {
      access_key: key,
      email: data.email,
      form: kind,
      subject: kind === "waitlist"
        ? "Fluanci waitlist signup"
        : `[${data.subject || "General"}] Message from ${data.name || "website"}`,
      message: kind === "waitlist"
        ? `Please add me to the Fluanci waitlist.\n\nEmail: ${data.email}\n\nI understand Fluanci will only use this address to send updates about Lerato, and I can ask to be removed at any time.`
        : data.message,
    };
    if (kind === "contact") {
      payload.name = data.name;
      payload.topic = data.subject || "General";
    } else {
      payload.name = "Waitlist";
    }
    return payload;
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
      if (data._gotcha || data.botcheck) return;

      const key = configuredFormKey();
      if (!key) {
        window.location.href = mailtoFor(kind, data);
        showStatus(form, "success",
          kind === "waitlist"
            ? "Your email app should open with a ready-to-send message. Press send and you're on the list."
            : "Your email app should open with your message ready. Press send to reach us.");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const label = btn && btn.querySelector("span");
      const original = label ? label.textContent : "";
      if (btn) btn.disabled = true;
      if (label) label.textContent = kind === "waitlist" ? "Joining…" : "Sending…";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payloadFor(kind, data, key)),
        });
        let json = null;
        try { json = await res.json(); } catch (err) { json = null; }
        if (!res.ok || !json || json.success !== true) throw new Error("submit failed");
        form.reset();
        showStatus(form, "success",
          kind === "waitlist"
            ? "You're on the list. We'll email you when there's real news about Lerato."
            : "Message sent. Thank you for reaching out.");
      } catch (err) {
        const network = err instanceof TypeError;
        if (network) {
          window.location.href = mailtoFor(kind, data);
          showStatus(form, "success",
            kind === "waitlist"
              ? "The form service didn't respond. Your email app should open with a ready-to-send message. Press send and you're on the list."
              : "The form service didn't respond. Your email app should open with your message ready. Press send to reach us.");
        } else {
          showStatus(form, "error", `That didn't go through. Try again, or email ${CONTACT_EMAIL} directly.`);
        }
      } finally {
        if (btn) btn.disabled = false;
        if (label) label.textContent = original;
      }
    });
  });
})();
