/*
 * Zvuk motora v článku o športových autách (#article/7).
 * Karty sa do stránky vkladajú dynamicky cez router, preto sa používa delegovanie udalostí:
 * jeden listener na dokumente, ktorý zachytí kliknutie na akékoľvek tlačidlo .btn-motor.
 * Kým zvuk hrá, karta má triedu "vibruje" (CSS animácia @keyframes motor-vibracie).
 */
const sounds = {};      // cache audio objektov podľa adresy súboru
let playing = null;     // { audio, card, btn } práve hrajúci motor

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
    stop();                       // vždy beží len jeden motor
    if (wasThis) return;          // druhé kliknutie na ten istý motor ho vypne

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

// pri zmene trasy sa motor vypne
window.addEventListener("hashchange", stop);
