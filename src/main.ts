import './style.css';

const LINES: string[] = [
    "I’m not trying to be extra… but you just raised the standard in here.",
    "Quick question—are you always this effortless, or am I just lucky today?",
    "You’ve got that calm confidence… it’s dangerous.",
    "I was gonna play it cool, but you’re making it hard to pretend I didn’t notice.",
    "If good energy had a face… yeah, it’d be you.",
    "Not to interrupt your day, but you just became the highlight.",
    "You look like someone who makes ordinary moments feel expensive.",
    "I’m normally focused… but you’ve officially stolen the agenda.",
    "I’m not flirting. I’m just being honest—you’re a vibe.",
    "You’ve got that ‘main character’ aura. I respect it."
];

const ICONS: string[] = ["✨", "🔥", "💫", "⚡️", "💎", "🎯", "🌶️"];

const genBtn = document.getElementById("genBtn") as HTMLButtonElement | null;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement | null;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement | null;
const actionsRow = document.getElementById("actionsRow") as HTMLDivElement | null;
const copyCaBtn = document.getElementById("copyCaBtn") as HTMLButtonElement | null;

// History elements
const historyBtn = document.getElementById("historyBtn") as HTMLButtonElement | null;
const historyList = document.getElementById("historyList") as HTMLDivElement | null;


const rizzText = document.getElementById("rizzText") as HTMLParagraphElement | null;
const responseLoader = document.getElementById("responseLoader") as HTMLDivElement | null;
const toast = document.getElementById("toast") as HTMLDivElement | null;
const loader = document.getElementById("loader") as HTMLDivElement | null;

// Remove loader after delay
window.addEventListener("load", () => {
    if (loader) {
        setTimeout(() => {
            loader.classList.add("hidden");
            setTimeout(() => {
                loader.remove();
            }, 300);
        }, 3000);
    }
});

const STORAGE_KEY = "rizz_history_v1";

function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

function showToast(text: string) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
}

function getHistory(): string[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

function setHistory(items: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 30)));
}

function renderHistory() {
    if (!historyList) return;
    const items = getHistory();
    historyList.innerHTML = "";

    // Add Header with Close Button
    const header = document.createElement("div");
    header.className = "historyHeader";
    header.innerHTML = `
    <span>My Rizz</span>
    <button class="closeHistoryBtn" id="closeHistoryBtn" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
    historyList.appendChild(header);

    // Re-attach listener for new close button
    const closeBtn = header.querySelector("#closeHistoryBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            triggerHaptic();
            historyList.classList.remove("active");
        });
    }

    if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "emptyState";
        empty.textContent = "No rizz saved yet.";
        historyList.appendChild(empty);
        return;
    }

    items.forEach((line) => {
        const row = document.createElement("div");
        row.className = "hItem";
        row.textContent = line;

        // Interaction: Load into main view
        row.addEventListener("click", () => {
            triggerHaptic();

            // Show content
            if (rizzText) {
                rizzText.textContent = line;
                rizzText.style.display = 'block';
            }

            // Show actions
            if (actionsRow) {
                actionsRow.classList.add("show");
            }

            // Close history just in case
            historyList.classList.remove("active");
        });
        historyList.appendChild(row);
    });
}

function pickLine(): string {
    const i = Math.floor(Math.random() * LINES.length);
    const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
    return `${icon} ${LINES[i]}`;
}

if (genBtn) {
    genBtn.addEventListener("click", () => {
        triggerHaptic();

        // Set inactive state
        genBtn.disabled = true;

        // Reset
        if (rizzText) rizzText.style.display = 'none';
        if (responseLoader) responseLoader.classList.add('active');
        if (actionsRow) actionsRow.classList.remove("show"); // Hide actions while loading

        // Mimic API/Think time
        setTimeout(() => {
            if (responseLoader) responseLoader.classList.remove('active');
            if (rizzText) {
                rizzText.style.display = 'block';
                const line = pickLine();
                rizzText.textContent = line;
            }

            // Show actions
            if (actionsRow) actionsRow.classList.add("show");

            // Re-enable button
            genBtn.disabled = false;
        }, 1500);
    });
}

if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        triggerHaptic();
        let text = rizzText?.textContent || "";
        if (!text) return;

        // Strip leading emoji + space for cleaner copy
        text = text.replace(/^[✨🔥💫⚡️💎🎯🌶️]\s*/, '');

        await navigator.clipboard.writeText(text);
        showToast("Copied Rizz ✓");
    });
}

if (copyCaBtn) {
    copyCaBtn.addEventListener("click", async () => {
        triggerHaptic();
        const text = "8x...dead"; // In reality copy full address
        await navigator.clipboard.writeText(text);
        showToast("CA Copied ✓");
    });
}

if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        triggerHaptic();
        const text = rizzText?.textContent || "";
        if (!text) return;

        const items = getHistory();
        const next = [text, ...items.filter(x => x !== text)];
        setHistory(next);
        renderHistory();
        showToast("Saved ✓");
    });
}

// Toggle History
if (historyBtn && historyList) {
    historyBtn.addEventListener("click", () => {
        triggerHaptic();
        historyList.classList.toggle("active");
    });
}

renderHistory();
