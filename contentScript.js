(() => {
  let youtubeLeftControls, youtubePlayer;

  const rewindBtn = document.createElement("img");
  const fastForwardBtn = document.createElement("img");

  const addSeekBtns = () => {
    const seekBtnsContainer = document.createElement("div");

    seekBtnsContainer.className = "seek-btns-container " + "ytp-right-controls";

    rewindBtn.src = chrome.runtime.getURL("assets/rewind.svg");
    rewindBtn.className = "ytp-button " + "rewind-btn " + "seek-ext-btn " + "ytp-chrome-controls ";

    fastForwardBtn.src = chrome.runtime.getURL("assets/fast-forward.svg");
    fastForwardBtn.className = "ytp-button " + "fast-forward-btn " + "seek-ext-btn " + "ytp-chrome-controls";

    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];



    function addToolTip(eventTarget) {
      const toolTipContainer = document.createElement("div");
      toolTipContainer.className = "ytp-tooltip " + "ytp-bottom " + "seek-ext-tooltip";

      const btnRect = fastForwardBtn.getBoundingClientRect();
      const playerRect = youtubePlayer.getBoundingClientRect();

      let left, top;

      if (eventTarget === fastForwardBtn) {
        left = (btnRect.left - playerRect.left + btnRect.width / 2) - (playerRect.height * 0.15);;
        top = btnRect.top - playerRect.top - toolTipContainer.offsetHeight - (playerRect.height * 0.091);
      }

      else if (eventTarget === rewindBtn) {
        left = (btnRect.left - playerRect.left + btnRect.width / 2) - (playerRect.height * 0.19);;
        top = btnRect.top - playerRect.top - toolTipContainer.offsetHeight - (playerRect.height * 0.091);
      }

      toolTipContainer.style.left = `${left}px`;
      toolTipContainer.style.top = `${top}px`;

      const textWrapper = document.createElement('div');
      textWrapper.className = "ytp-tooltip-text-wrapper";

      const bottomText = document.createElement('div');
      bottomText.className = "ytp-tooltip-bottom-text";

      const text = document.createElement('span');
      text.className = "ytp-tooltip-text";
      text.textContent = eventTarget.title;

      const videoPlayer = document.getElementsByClassName("html5-video-player")[0];

      videoPlayer.appendChild(toolTipContainer);
      toolTipContainer.appendChild(textWrapper);

      textWrapper.appendChild(bottomText);
      bottomText.appendChild(text);
    }



    function removeToolTip() {
      const videoPlayer = document.getElementsByClassName("html5-video-player")[0];
      const toolTipContainer = document.getElementsByClassName("seek-ext-tooltip")[0];

      videoPlayer.removeChild(toolTipContainer)
    }



    fastForwardBtn.addEventListener('mouseenter', () => { addToolTip(event.currentTarget);  })
    rewindBtn.addEventListener('mouseenter', () => { addToolTip(event.currentTarget);  })

    fastForwardBtn.addEventListener('mouseleave', () => { removeToolTip();  })
    rewindBtn.addEventListener('mouseleave', () => { removeToolTip();  })

    youtubeLeftControls.appendChild(seekBtnsContainer);
    seekBtnsContainer.appendChild(rewindBtn);
    seekBtnsContainer.appendChild(fastForwardBtn);
  }

  const initSeekButtons = () => {
    chrome.storage.sync.get("seekDuration", (result) => {
      let seekDuration = parseInt(result.seekDuration) || 10;

      rewindBtn.title = `Rewind ${seekDuration} seconds`;

      fastForwardBtn.title = `Fast forward ${seekDuration} seconds`;

      rewindBtn.onclick = () => { youtubePlayer.currentTime -= seekDuration; };

      fastForwardBtn.onclick = () => { youtubePlayer.currentTime += seekDuration; };
    })
  }

  // Wait for YouTube SPA navigation to finish before injecting buttons
  document.addEventListener("yt-navigate-finish", () => {
    addSeekBtns();
    initSeekButtons();
  });

  // Update seek button functionality when seek duration changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.seekDuration) {
      initSeekButtons();
    }
  });
})();