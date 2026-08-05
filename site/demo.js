const inputs = {
  volume: document.querySelector("#volume"),
  minutes: document.querySelector("#minutes"),
  share: document.querySelector("#share"),
  reviews: document.querySelector("#reviews"),
  reviewMinutes: document.querySelector("#review-minutes"),
};

const one = (value) => Math.round(value * 10) / 10;
const signedPercent = (value) => `${value < 0 ? "−" : "+"}${Math.abs(value)}%`;

function render() {
  const volume = Number(inputs.volume.value);
  const minutes = Number(inputs.minutes.value);
  const share = Number(inputs.share.value) / 100;
  const reviews = Number(inputs.reviews.value);
  const reviewMinutes = Number(inputs.reviewMinutes.value);

  const before = (volume * minutes) / 60;
  const remaining = before * share;
  const created = (reviews * reviewMinutes) / 60;
  const after = remaining + created;
  const change = before === 0 ? 0 : Math.round(((after - before) / before) * 100);
  const scale = Math.max(before, after, 1);

  document.querySelector("#volume-output").value = volume;
  document.querySelector("#minutes-output").value = minutes;
  document.querySelector("#share-output").value = `${Math.round(share * 100)}%`;
  document.querySelector("#reviews-output").value = reviews;
  document.querySelector("#review-minutes-output").value = reviewMinutes;
  document.querySelector("#before-hours").textContent = one(before);
  document.querySelector("#after-hours").textContent = one(after);
  document.querySelector("#change-percent").textContent = signedPercent(change);
  document.querySelector("#new-hours").textContent = `${one(created)} hours`;
  document.querySelector("#before-bar").style.width = `${(before / scale) * 100}%`;
  document.querySelector("#after-bar").style.width = `${(after / scale) * 100}%`;
  document.querySelector("#formula").textContent =
    `${volume} × ${minutes} ÷ 60 = ${one(before)} hours today · ` +
    `${volume} × ${Math.round(share * 100)}% × ${minutes} ÷ 60 + ` +
    `${reviews} × ${reviewMinutes} ÷ 60 = ${one(after)} after`;
}

for (const input of Object.values(inputs)) input.addEventListener("input", render);
render();
