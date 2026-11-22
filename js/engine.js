/*---------------------Zvuky motora---------------------*/
const sounds = {};
let playing = null;

function stop() {
    if (!playing) return;
    const { audio, card, btn } = playing;
    audio.pause();
    audio.currentTime = 0;
    card.classList.remove("vibruje");
    btn.setAttribute("aria-pressed", "false");
    btn.querySelector(".btn-motor-text").textContent = "Naštartovať motor";
    playing = null;
}

document.addEventListener("click", event => {
    const btn = event.target.closest(".btn-motor");
    if (!btn) return;

    const card = btn.closest(".auto-karta");
    const wasThis = playing && playing.btn === btn;
    stop();
    if (wasThis) return;

    const src = btn.dataset.sound;
    const audio = sounds[src] || (sounds[src] = new Audio(src));
    audio.currentTime = 0;

    audio.play().then(() => {
        playing = { audio, card, btn };
        card.classList.add("vibruje");
        btn.setAttribute("aria-pressed", "true");
        btn.querySelector(".btn-motor-text").textContent = "Vypnúť motor";
        audio.onended = stop;
    }).catch(() => {
        btn.querySelector(".btn-motor-text").textContent = "Zvuk sa nepodarilo prehrať";
    });
});


window.addEventListener("hashchange", stop);
