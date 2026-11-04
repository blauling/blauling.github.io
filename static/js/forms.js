(() => {
  const config = window.siteConfig;

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
