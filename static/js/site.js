(() => {
  const music = document.querySelector("#background-music");
  const clickTone = document.querySelector("#click-tone");

  if (!clickTone) {
    return;
  }

  const playClick = () => {
    clickTone.currentTime = 0;
    clickTone.play().catch(() => {});
  };

  if (music) {
    const startMusic = () => {
      music.play().catch(() => {});
    };

    document.addEventListener("pointerdown", startMusic, { once: true });
    document.addEventListener("keydown", startMusic, { once: true });
  }

  document.querySelectorAll("a, button").forEach((element) => {
    let playedOnPointer = false;

    element.addEventListener("pointerdown", () => {
      playedOnPointer = true;
      playClick();
    });

    element.addEventListener("click", (event) => {
      const link = element.closest("a");
      const url = link ? new URL(link.href, window.location.href) : null;
      const isInternalNavigation = url
        && url.origin === window.location.origin
        && url.pathname !== window.location.pathname
        && link.target !== "_blank"
        && !link.hasAttribute("download")
        && !event.metaKey
        && !event.ctrlKey
        && !event.shiftKey
        && !event.altKey;

      if (!playedOnPointer) {
        playClick();
      }
      playedOnPointer = false;

      if (isInternalNavigation) {
        event.preventDefault();
        window.setTimeout(() => {
          window.location.assign(url.href);
        }, 140);
      }
    });
  });
})();
