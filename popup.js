document.addEventListener("DOMContentLoaded", () => {
  let jumpDisplay = document.getElementsByClassName("jump-amount-display")[0];
  let jumpSlider = document.getElementsByClassName("jump-amount-slider")[0];

  chrome.storage.sync.get("seekDuration", (result) => {
    // Defaults to 10 if seekDuration undefined
    jumpSlider.value = result.seekDuration || 10;
    // Immediately update jumpDisplay value on pop up load
    jumpDisplay.textContent = `${jumpSlider.value} seconds`;
  })

  // Update jumpDisplay when jumpSlider value changes
  jumpSlider.addEventListener("input", () => {
    jumpDisplay.textContent = `${jumpSlider.value} seconds`;
  });

  // Save seekDuration value on change
  jumpSlider.addEventListener("change", () => {
    chrome.storage.sync.set({ seekDuration: jumpSlider.value });
  })
});