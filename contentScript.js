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

    // Remove tooltips on viewing mode change
    const theatreBtn = document.getElementsByClassName('ytp-size-button')[0];
    const observer = new MutationObserver(() => {
      if (document.getElementsByClassName("seek-ext-tooltip")[0]) {
        removeToolTip();
      }
    });
    observer.observe(theatreBtn, {
      attributes: true,
      attributeFilter: ['data-title-no-tooltip']
    });

    // Remove tooltips when chrome bottom opacity 0
    const chromeBottom = document.getElementsByClassName('ytp-chrome-bottom')[0];
    setInterval(() => {
      if (getComputedStyle(chromeBottom).opacity === '0' && document.getElementsByClassName("seek-ext-tooltip")[0]) {
        removeToolTip();
      }
    }, 100);

    function addToolTip(eventTarget) {
      const toolTipContainer = document.createElement("div");
      toolTipContainer.className = "ytp-tooltip ytp-bottom seek-ext-tooltip";

      const btnRect = eventTarget.getBoundingClientRect();
      const playerRect = document.getElementsByClassName("html5-video-player")[0].getBoundingClientRect();

      const left = btnRect.left - playerRect.left + btnRect.width / 2;

      const tooltipOffset = 50;
      const top = btnRect.top - playerRect.top - tooltipOffset;

      toolTipContainer.style.left = `${left}px`;
      toolTipContainer.style.top = `${top}px`;
      toolTipContainer.style.transform = "translateX(-50%)";

      const textWrapper = document.createElement('div');
      textWrapper.className = "ytp-tooltip-text-wrapper";

      const bottomText = document.createElement('div');
      bottomText.className = "ytp-tooltip-bottom-text";

      const text = document.createElement('span');
      text.className = "ytp-tooltip-text";
      text.textContent = eventTarget.ariaLabel;

      const videoPlayer = document.getElementsByClassName("html5-video-player")[0];
      videoPlayer.appendChild(toolTipContainer);
      toolTipContainer.appendChild(textWrapper);
      textWrapper.appendChild(bottomText);
      bottomText.appendChild(text);
    }

    function removeToolTip() {
      const videoPlayer = document.getElementsByClassName("html5-video-player")[0];
      const toolTipContainer = document.getElementsByClassName("seek-ext-tooltip")[0];
      if (toolTipContainer) {
        videoPlayer.removeChild(toolTipContainer);
      }
    }

    fastForwardBtn.addEventListener('mouseenter', () => { addToolTip(fastForwardBtn);  })
    rewindBtn.addEventListener('mouseenter', () => { addToolTip(rewindBtn);  })

    fastForwardBtn.addEventListener('mouseleave', () => { removeToolTip();  })
    rewindBtn.addEventListener('mouseleave', () => { removeToolTip();  })

    youtubeLeftControls.appendChild(seekBtnsContainer);
    seekBtnsContainer.appendChild(rewindBtn);
    seekBtnsContainer.appendChild(fastForwardBtn);
  }

  const initSeekButtons = () => {
    chrome.storage.sync.get("seekDuration", (result) => {
      let seekDuration = parseInt(result.seekDuration) || 10;

      fastForwardBtn.setAttribute('aria-label', `Fast forward ${seekDuration} seconds`);
      rewindBtn.setAttribute('aria-label', `Rewind ${seekDuration} seconds`);

      rewindBtn.onclick = () => { youtubePlayer.currentTime -= seekDuration; };

      fastForwardBtn.onclick = () => { youtubePlayer.currentTime += seekDuration; };
    })
  }

  document.addEventListener("yt-navigate-finish", () => {
    addSeekBtns();
    initSeekButtons();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.seekDuration) {
      initSeekButtons();
    }
  });
})();