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

  document.querySelectorAll(".panel-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => setPanel(toggle.dataset.panel, true, toggle));
  });

  document.querySelectorAll(".panel-back").forEach((back) => {
    back.addEventListener("click", () => setPanel(back.dataset.panel, false, back));
  });

  function setPanel(panelName, isOpen, source) {
    const panel = document.getElementById(panelName);
    const shell = document.querySelector(".home-shell");

    if (!panel || !shell) {
      return;
    }

    document.querySelectorAll(".panel-toggle").forEach((toggle) => {
      if (toggle.dataset.panel === panelName) {
        toggle.setAttribute("aria-expanded", String(isOpen));
      }
    });
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.toggleAttribute("inert", !isOpen);
    panel.classList.toggle("is-open", isOpen);
    shell.classList.toggle(`panel-${panelName}-open`, isOpen);

    if (isOpen) {
      const field = panel.querySelector("input, textarea");
      if (field) {
        field.focus();
      }
    } else if (source.classList.contains("panel-back")) {
      document.querySelector(`.panel-toggle[data-panel="${panelName}"]`).focus();
    }
  }

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
