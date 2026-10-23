// To receive form entries, paste the address of a form service here
// (for example a Formspree endpoint). While this is empty the form checks
// the fields but does not send anything, and tells the visitor so.
const FORM_ENDPOINT = "";

const form = document.getElementById("contact-form");
const errorBox = document.getElementById("form-error");
const statusBox = document.getElementById("form-status");

function showMessage(box, text) {
  errorBox.hidden = true;
  statusBox.hidden = true;
  box.textContent = text;
  box.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const consent = form.querySelector("#f-consent").checked;
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (!name || !emailOk || !consent) {
    showMessage(errorBox, "Add your name, a valid email address, and tick the box to continue.");
    return;
  }

  const first = name.split(" ")[0];

  if (!FORM_ENDPOINT) {
    showMessage(statusBox, "Thanks, " + first + ". Your entry is complete, but this form is not connected yet, so nothing was sent.");
    return;
  }

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });
    if (response.ok) {
      showMessage(statusBox, "Thanks, " + first + ". Your message has been sent.");
      form.reset();
    } else {
      showMessage(errorBox, "Something went wrong sending your message. Please try again.");
    }
  } catch (err) {
    showMessage(errorBox, "Something went wrong sending your message. Please try again.");
  }
});
