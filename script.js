// ===== PAGE SWITCHING =====
const pageHero = document.getElementById("page-hero");
const pageIntro = document.getElementById("page-intro");
const pageChat = document.getElementById("page-chat");

function showPage(page) {
  [pageHero, pageIntro, pageChat].forEach(p => p.classList.remove("page--visible"));
  page.classList.add("page--visible");
}

// buttons
const btnBegin = document.getElementById("btn-begin");
const btnVoice = document.getElementById("btn-voice");
const btnChat = document.getElementById("btn-chat");

if (btnBegin) {
  btnBegin.addEventListener("click", () => showPage(pageIntro));
}

if (btnChat) {
  btnChat.addEventListener("click", () => showPage(pageChat));
}

// ===== VOICE (Page 2) – simple text-to-speech =====

const soraIntroText =
  "Hi, I’m Sora. I’m still learning, but I’m here to sit with your overthinking, " +
  "slow it down, and remind you that you don’t have to fix everything tonight.";

if (btnVoice) {
  btnVoice.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support SORA voice yet.");
      return;
    }
    // stop any old speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(soraIntroText);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  });
}

// ===== CHAT LOGIC (Page 3) =====

const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const SORA_FIXED_REPLY =
  "The work is beginning. This tool is not properly completed. Please wait some time.";

// helper: time
function timeLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = ((h + 11) % 12) + 1;
  return `${h}:${m} ${ampm}`;
}

// message DOM builders
function addMessage(text, sender = "sora") {
  if (!chatWindow) return;
  const row = document.createElement("div");
  row.classList.add("msg-row", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("msg-bubble", sender === "user" ? "user" : "sora");
  bubble.textContent = text;

  const meta = document.createElement("div");
  meta.classList.add("msg-meta");
  meta.textContent = (sender === "user" ? "You" : "SORA") + " • " + timeLabel();

  row.appendChild(bubble);
  row.appendChild(meta);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  const row = document.createElement("div");
  row.classList.add("msg-row", "sora");

  const bubble = document.createElement("div");
  bubble.classList.add("msg-bubble", "sora");

  const dots = document.createElement("div");
  dots.classList.add("typing");
  dots.innerHTML = "<span></span><span></span><span></span>";

  bubble.appendChild(dots);
  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return row;
}

function removeTyping(row) {
  if (row && row.parentNode) row.parentNode.removeChild(row);
}

// auto-resize textarea
if (userInput) {
  userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 90) + "px";
  });
}

// initial welcome line
if (chatWindow) {
  addMessage("Hi, I’m SORA. This is just the first prototype. Let me hold space for you while the real brain is being built.");
}

// handle send
if (chatForm) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";
    userInput.style.height = "40px";

    const typingRow = showTyping();

    // fake delay then fixed reply
    setTimeout(() => {
      removeTyping(typingRow);
      addMessage(SORA_FIXED_REPLY, "sora");
    }, 900);
  });
}
