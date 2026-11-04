(() => {
  const config = window.siteConfig;

  let audioContext;

  const playClick = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    audioContext = audioContext || new AudioContextClass();
    audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.045);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  };

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("pointerdown", playClick);
  });

  document.querySelectorAll(".contact-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const section = document.getElementById(toggle.getAttribute("aria-controls"));
      const isHidden = section.hasAttribute("hidden");

      toggle.setAttribute("aria-expanded", String(isHidden));
      section.toggleAttribute("hidden", !isHidden);

      if (isHidden) {
        requestAnimationFrame(() => {
          section.classList.add("is-visible");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } else {
        section.classList.remove("is-visible");
      }
    });
  });

  if (!config || !config.supabaseUrl || !config.supabasePublishableKey) {
    return;
  }

  document.querySelectorAll("[data-supabase-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const status = form.querySelector("[data-form-status]");
      const data = Object.fromEntries(new FormData(form).entries());

      button.disabled = true;
      playClick();
      status.textContent = "Sending…";

      try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/${form.dataset.table}`, {
          method: "POST",
          headers: {
            apikey: config.supabasePublishableKey,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("The submission could not be saved.");
        }

        form.reset();
        status.textContent = "Thanks — your message was sent.";
      } catch (error) {
        status.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  });
})();
