(() => {
  const music = document.querySelector("#background-music");
  const clickTone = document.querySelector("#click-tone");

  if (!music || !clickTone) {
    return;
  }

  const startMusic = () => {
    music.play().catch(() => {});
  };

  document.addEventListener("pointerdown", startMusic, { once: true });
  document.addEventListener("keydown", startMusic, { once: true });

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("click", () => {
      clickTone.currentTime = 0;
      clickTone.play().catch(() => {});
    });
  });
})();
