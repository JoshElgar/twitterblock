// content.js
// content.js
// Define the observers outside of the event listener
let menuObserver;
let dialogObserver;

// Function to initialize the observers
function initializeObservers() {
  menuObserver = new MutationObserver((mutations, obs) => {
    const menuItems = Array.from(
      document.querySelectorAll('[role="menuitem"]')
    );
    const blockOption = menuItems.find((item) =>
      item.textContent.includes("Block")
    );

    if (blockOption) {
      // Use MutationObserver to wait for the confirmation dialog and click the Block button
      dialogObserver = new MutationObserver((mutations, obs) => {
        const confirmBlockButton = document.querySelector(
          '[data-testid="confirmationSheetConfirm"]'
        );
        if (confirmBlockButton) {
          triggerClick(confirmBlockButton);
          obs.disconnect(); // Stop observing once the confirmation button is clicked

          // Log and alert after blocking
          console.log("User blocked.");
        }
      });

      // Start observing for the confirmation dialog
      dialogObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      triggerClick(blockOption);

      obs.disconnect(); // Stop observing once the Block option is found and clicked
    }
  });
}

// Call the function to initialize the observers
initializeObservers();

document.addEventListener("click", function (event) {
  // Check if Shift key is pressed during the click
  //   alert("got click");
  if (event.shiftKey) {
    // alert("got click with shift");
    let target = event.target;

    // Check if the clicked element is a profile picture or inside a profile picture container
    let profilePic = target.closest('[data-testid*="UserAvatar-Container"]'); // Use attribute selector with wildcard to match elements that contain "UserAvatar-Container"

    if (profilePic) {
      //   alert("preventing default");
      event.preventDefault(); // Prevent default action (opening in a new tab)
      let tweetElement = profilePic.closest("article"); // Adjust if Twitter's structure changes
      if (tweetElement) {
        let menuButton = tweetElement.querySelector('[aria-label="More"]'); // Adjust the selector as needed
        if (menuButton) {
          triggerClick(menuButton);

          // Start observing for the menu to open
          menuObserver.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      }
    }
  }
});

// Function to simulate a click event
function triggerClick(element) {
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(clickEvent);
}

// CSS to inject for the glowing effect
const css = `
  .shift-hover-glow {
    outline: 2px solid red !important;
    box-shadow: 0 0 8px red !important;
    border-radius: 500px;
  }
`;

// Create a style element and inject CSS for the glowing effect
const styleElement = document.createElement("style");
document.head.appendChild(styleElement);
styleElement.textContent = css;

// Function to check if an element's data-testid attribute contains "UserAvatar-Container"
function isProfilePic(element) {
  return Array.from(element.attributes).some(
    (attr) =>
      attr.name === "data-testid" && attr.value.includes("UserAvatar-Container")
  );
}

// Function to add or remove glowing effect based on Shift key state and cursor position
function updateGlowEffect(event) {
  if (!event.shiftKey) {
    // Remove glow from all elements when Shift key is not pressed
    document.querySelectorAll(".shift-hover-glow").forEach((element) => {
      element.classList.remove("shift-hover-glow");
    });
    return; // Exit the function early since Shift is not pressed
  }

  // If Shift is pressed, add or remove glow based on hover state
  document.querySelectorAll("[data-testid]").forEach((element) => {
    if (isProfilePic(element) && element.contains(event.target)) {
      element.classList.add("shift-hover-glow");
    } else {
      element.classList.remove("shift-hover-glow");
    }
  });
}

// Listen for mousemove to update the glow effect based on hover and Shift key state
document.addEventListener("mousemove", updateGlowEffect);

// Cleanup the glow when the Shift key is released, in case the mouse isn't moving
document.addEventListener("keyup", (event) => {
  if (event.key === "Shift") {
    document.querySelectorAll(".shift-hover-glow").forEach((element) => {
      element.classList.remove("shift-hover-glow");
    });
  }
});
