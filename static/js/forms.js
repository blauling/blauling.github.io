(() => {
  const config = window.siteConfig;

  let clickTone;

  const playClick = () => {
    if (!config || !config.clickToneUrl) {
      return;
    }

    clickTone = clickTone || new Audio(config.clickToneUrl);
    clickTone.currentTime = 0;
    const playback = clickTone.play();

    if (playback) {
      playback.catch(() => {
        clickTone.pause();
      });
    }
  };

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("pointerdown", playClick);
  });

  document.querySelectorAll(".contact-toggle").forEach((toggle) => {
    const section = document.getElementById(toggle.getAttribute("aria-controls"));
    const close = section.querySelector(".contact-close");

    const setOpen = (isOpen) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
      section.setAttribute("aria-hidden", String(!isOpen));
      section.toggleAttribute("inert", !isOpen);
      section.classList.toggle("is-open", isOpen);

      if (isOpen) {
        section.querySelector("input").focus();
      } else {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", () => setOpen(true));
    close.addEventListener("click", () => setOpen(false));
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
