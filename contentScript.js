(() => {
  let youtubeLeftControls, youtubePlayer;

  const rewindBtn = document.createElement("img");
  const fastForwardBtn = document.createElement("img");

  const addSeekBtns = () => {
    const seekBtnsContainer = document.createElement("div");

    seekBtnsContainer.className = "seek-btns-container";

    rewindBtn.src = chrome.runtime.getURL("assets/rewind.svg");
    rewindBtn.className = "ytp-button " + "rewind-btn " + "seek-ext-btn";

    fastForwardBtn.src = chrome.runtime.getURL("assets/fast-forward.svg");
    fastForwardBtn.className = "ytp-button " + "fast-forward-btn " + "seek-ext-btn";

    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    youtubeLeftControls.appendChild(seekBtnsContainer);
    seekBtnsContainer.appendChild(rewindBtn);
    seekBtnsContainer.appendChild(fastForwardBtn);
  }

  const initSeekButtons = () => {
    chrome.storage.sync.get("seekDuration", (result) => {
      let seekDuration = parseInt(result.seekDuration) || 10;

      rewindBtn.title = `Click to rewind ${seekDuration} seconds`;

      fastForwardBtn.title = `Click to fast forward ${seekDuration} seconds`;

      rewindBtn.onclick = () => { youtubePlayer.currentTime -= seekDuration; };

      fastForwardBtn.onclick = () => { youtubePlayer.currentTime += seekDuration; };
    })
  }

  addSeekBtns();
  initSeekButtons();

  // Update seek button functionality when seek duration changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.seekDuration) {
      initSeekButtons();
    }
  });
})();
