/* script.js
 - Drop your beat files under /audio/beat-*.mp3 or update the paths below
 - This file renders the beats, handles search, playback, and contact mailto
*/
const featuredBeat = {
  title: "Broken Strings",
  genre: "Emotional Trap",
  tags: "melodic • emotional",
  cover: "images/broken-strings.jpg",
  src: "audio/countrytrap.mp3",
  price: "$5",
  artist: "JayNoMore"
};

const beats = [
  {
    id: "B001",
    title: "Afterglow",
    tags: "trap • melodic • emotional",
    price: "$5",
    length: "2:10",
    src: "audio/midnighttrap.mp3",
    cover: "images/afterglow.jpg", // optional cover image path
    artist: "JayNoMore",
    genre: "emotional trap"
  },
  {
    id: "B002",
    title: "Sunset Drive",
    tags: "trap • melodic • hype",
    price: "$5",
    length: "2:09",
    src: "audio/drilltrap.mp3",
    cover: "",
    artist: "JayNoMore",
    genre: "hype trap"
  },
  {
    id: "B003",
    title: "Cold Season",
    tags: "hip-hop • drill • upbeat",
    price: "$5",
    length: "2:04",
    src: "audio/drill.mp3",
    cover: "",
    artist: "JayNoMore",
    genre: "drill"
  },
  {
    id: "B004",
    title: "Heart.exe",
    tags: "hyperpop • trap • upbeat",
    price: "$5",
    length: "1:55",
    src: "audio/hyperpop.mp3",
    cover: "",
    artist: "JayNoMore",
    genre: "hyperpop"
  },
  // Add more beats here...
];



/* ---- DOM refs ---- */
const beatsTableBody = document.querySelector("#beats-table tbody");
const searchInput = document.getElementById("search");
const emptyNote = document.getElementById("empty-note");

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerCover = document.getElementById("player-cover");
const volumeEl = document.getElementById("volume");
const buyNowBtn = document.getElementById("buy-now");

const contactBtn = document.getElementById("contact-btn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalCancel = document.getElementById("modal-cancel");
const contactForm = document.getElementById("contact-form");
const yearSpan = document.getElementById("year");

/* ---- state ---- */
let filteredBeats = beats.slice();
let currentIndex = -1;
let isPlaying = false;

/* ---- initialization ---- */
yearSpan.textContent = new Date().getFullYear();
renderTable();



/* ---- functions ---- */
function renderTable() {
  beatsTableBody.innerHTML = "";
  if (filteredBeats.length === 0) {
    emptyNote.classList.remove("hidden");
    return;
  } else {
    emptyNote.classList.add("hidden");
  }

  filteredBeats.forEach((beat, idx) => {
    const tr = document.createElement("tr");
    tr.className = "beats-row";
    tr.tabIndex = 0;
    tr.dataset.index = idx;

    tr.innerHTML = `
      <td class="track-index">${idx + 1}</td>
      <td>
        <div class="track-title">${beat.title}</div>
        <div class="track-tags">${beat.artist} • ${beat.tags}</div>
      </td>
      <td>${beat.tags}</td>
      <td class="price">${beat.price}</td>
      <td class="length">${beat.length}</td>
    `;

    // click to play
    tr.addEventListener("click", () => {
      playBeatByFilteredIndex(idx);
    });

    // keyboard support
    tr.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playBeatByFilteredIndex(idx);
      }
    });

    beatsTableBody.appendChild(tr);
  });
}

/* === Featured Beat Display === */
const featuredImg = document.getElementById("featured-img");
const featuredTitle = document.getElementById("featured-title");
const featuredGenre = document.getElementById("featured-genre");
const featuredTags = document.getElementById("featured-tags");
const featuredPlay = document.getElementById("featured-play");
const featuredBuy = document.getElementById("featured-buy");

function renderFeatured() {
  featuredImg.src = featuredBeat.cover;
  featuredTitle.textContent = featuredBeat.title;
  featuredGenre.textContent = featuredBeat.genre;
  featuredTags.textContent = featuredBeat.tags;
}

featuredPlay.addEventListener("click", () => {
  loadAndPlay({
    title: featuredBeat.title,
    tags: featuredBeat.tags,
    artist: featuredBeat.artist,
    src: featuredBeat.src
  });
});

featuredBuy.addEventListener("click", () => {
  const subject = `Purchase inquiry — ${featuredBeat.title}`;
  const body = `Hi, I'm interested in buying the beat "${featuredBeat.title}" (${featuredBeat.genre}).\n\nPrice: ${featuredBeat.price}`;
  window.location.href = `mailto:beats@jaynomore.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

renderFeatured();


function playBeatByFilteredIndex(filteredIdx) {
  const beat = filteredBeats[filteredIdx];
  if (!beat) return;

  // update currentIndex relative to full beats array
  currentIndex = beats.findIndex(b => b.id === beat.id);

  loadAndPlay(beat);
}

function loadAndPlay(beat) {
  if (!beat.src) {
    alert("No audio source set for this beat. Update script.js with your audio file path.");
    return;
  }
  audio.src = beat.src;
  playerTitle.textContent = beat.title;
  playerArtist.textContent = beat.artist + " • " + beat.tags;
  playerCover.textContent = beat.title.split(" ").slice(0,1)[0]; // simple text cover fallback
  audio.currentTime = 0;
  audio.volume = parseFloat(volumeEl.value);
  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(err => {
    console.warn("Playback failed:", err);
  });
}

/* ---- playback controls ---- */
playBtn.addEventListener("click", () => {
  if (!audio.src) {
    // play first beat if none selected
    if (filteredBeats.length) {
      playBeatByFilteredIndex(0);
    }
    return;
  }
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => { isPlaying = true; updatePlayButton(); });
audio.addEventListener("pause", () => { isPlaying = false; updatePlayButton(); });

function updatePlayButton() {
  playBtn.textContent = isPlaying ? "⏸" : "▶️";
}

prevBtn.addEventListener("click", () => {
  if (currentIndex <= 0) {
    currentIndex = beats.length - 1;
  } else currentIndex--;
  loadAndPlay(beats[currentIndex]);
});

nextBtn.addEventListener("click", () => {
  if (currentIndex >= beats.length - 1) currentIndex = 0;
  else currentIndex++;
  loadAndPlay(beats[currentIndex]);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  progress.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progress.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

volumeEl.addEventListener("input", () => {
  audio.volume = parseFloat(volumeEl.value);
});

/* ---- utilities ---- */
function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ---- search/filter ---- */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    filteredBeats = beats.slice();
  } else {
    filteredBeats = beats.filter(b => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.tags.toLowerCase().includes(q) ||
        b.artist.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    });
  }
  renderTable();
});

/* === Genre Filtering === */
const genreButtons = document.querySelectorAll(".genre-btn");

genreButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    genreButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const genre = btn.dataset.genre;
    filterBeatsByGenre(genre);
  });
});

function filterBeatsByGenre(genre) {
  if (genre === "all") {
    filteredBeats = beats.slice();
  } else {
    filteredBeats = beats.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }
  renderTable();
}


/* ---- buy / contact logic ---- */
contactBtn.addEventListener("click", () => {
  showModal();
});
document.getElementById("home-btn").addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
document.getElementById("library-btn").addEventListener("click", () => alert("Library view not implemented in demo."));

closeModal.addEventListener("click", hideModal);
modalCancel.addEventListener("click", hideModal);

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(contactForm);
  const name = form.get("name") || "Buyer";
  const email = form.get("email") || "";
  const message = form.get("message") || "";
  const mailto = `mailto:jaynomoreofficial@gmail.com?subject=${encodeURIComponent("Beat purchase / inquiry from " + name)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
  window.location.href = mailto;
  hideModal();
});

/* Buy Now button uses current track */
buyNowBtn.addEventListener("click", () => {
  if (currentIndex < 0 || !beats[currentIndex]) {
    alert("Select a beat to buy first.");
    return;
  }
  const b = beats[currentIndex];
  const subject = `Purchase inquiry — ${b.title} (${b.id})`;
  const body = `Hi,\n\nI want to purchase the beat:\n\nTitle: ${b.title}\nID: ${b.id}\nPrice: ${b.price}\n\nPlease send purchase details and license options.\n\nThanks!`;
  window.location.href = `mailto:jaynomoreofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

/* modal helpers */
function showModal() {
  modal.classList.remove("hidden");
}
function hideModal() {
  modal.classList.add("hidden");
}

/* ---- keyboard: space for play/pause ---- */
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    if (audio.src) {
      if (audio.paused) audio.play(); else audio.pause();
    } else if (filteredBeats.length) {
      playBeatByFilteredIndex(0);
    }
  }
});
