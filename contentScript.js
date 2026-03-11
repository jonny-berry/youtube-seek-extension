(() => {
  let youtubeLeftControls, youtubePlayer;

  const addSeekBtns = () => {
    const seekBtnsContainer = document.createElement("div");
    const rewindBtn = document.createElement("img");
    const fastForwardBtn = document.createElement("img");

    seekBtnsContainer.className = "seek-btns-container";
    
    rewindBtn.src = chrome.runtime.getURL("assets/rewind.svg");
    rewindBtn.className = "ytp-button " + "rewind-btn " + "seek-ext-btn";
    rewindBtn.title = "Click to rewind 10 seconds";

    fastForwardBtn.src = chrome.runtime.getURL("assets/fast-forward.svg");
    fastForwardBtn.className = "ytp-button " + "fast-forward-btn " + "seek-ext-btn";
    fastForwardBtn.title = "Click to fast forward 10 seconds";

    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    youtubeLeftControls.appendChild(seekBtnsContainer);
    seekBtnsContainer.appendChild(rewindBtn);
    seekBtnsContainer.appendChild(fastForwardBtn);

    rewindBtn.addEventListener("click", () => {
      youtubePlayer.currentTime -= 10;
    })

    fastForwardBtn.addEventListener("click", () => {
      youtubePlayer.currentTime += 10;
    })
  }

  addSeekBtns();
})();
