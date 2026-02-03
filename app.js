function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".navlinks a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });
}


function setupHoverPlay() {
  document.querySelectorAll("[data-hover-play='true']").forEach(media => {
    media.addEventListener("mouseenter", () => {
      if (media.tagName.toLowerCase() !== "video") return;
      media.play().catch(() => {});
    });
    media.addEventListener("mouseleave", () => {
      if (media.tagName.toLowerCase() !== "video") return;
      media.pause();
    });
  });
}


function setupVideoMusic(){
  const v = document.getElementById("bgVideoMusic");
  const btn = document.getElementById("musicBtn");
  if(!v || !btn) return;

  const on = localStorage.getItem("bgVideoOn") === "1";
  const t = Number(localStorage.getItem("bgVideoTime") || "0");
  if(t > 0) {
    try { v.currentTime = t; } catch(e) {}
  }

  function setBtn(p){
    btn.innerHTML = p ? "⏸️ <small>Music</small>" : "▶️ <small>Music</small>";
  }
  setBtn(on);

  if(on){
    v.play().then(()=>setBtn(true)).catch(()=> {
      localStorage.setItem("bgVideoOn","0");
      setBtn(false);
    });
  }

  btn.onclick = ()=>{
    if(v.paused){
      v.play().then(()=>{
        localStorage.setItem("bgVideoOn","1");
        setBtn(true);
      }).catch(()=>{});
    }else{
      v.pause();
      localStorage.setItem("bgVideoOn","0");
      setBtn(false);
    }
  };

  setInterval(()=>{
    localStorage.setItem("bgVideoTime", String(v.currentTime || 0));
  }, 900);
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupHoverPlay();
  setupVideoMusic();
});
const audio = document.getElementById("bgmusic");
const btn = document.getElementById("musicBtn");

const TIME_KEY = "bgmusic_time";
const PLAY_KEY = "bgmusic_playing";


const savedTime = parseFloat(localStorage.getItem(TIME_KEY));
if (!Number.isNaN(savedTime)) audio.currentTime = savedTime;


const shouldPlay = localStorage.getItem(PLAY_KEY) === "1";

if (shouldPlay) {
  audio.play().catch(() => {
    
  });
}

function updateBtn() {
  btn.textContent = audio.paused ? "Music" : "Pause";
}

btn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().then(() => {
      localStorage.setItem(PLAY_KEY, "1");
      updateBtn();
    }).catch(() => {});
  } else {
    audio.pause();
    localStorage.setItem(PLAY_KEY, "0");
    updateBtn();
  }
});


setInterval(() => {
  localStorage.setItem(TIME_KEY, String(audio.currentTime));
}, 1000);

window.addEventListener("beforeunload", () => {
  localStorage.setItem(TIME_KEY, String(audio.currentTime));
  localStorage.setItem(PLAY_KEY, audio.paused ? "0" : "1");
});

updateBtn();
