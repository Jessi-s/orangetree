const bilder = [
    {
        datei: "Baum Phase 1.png",
        titel: "Phase 0: ",
        text: "Der Orangenbaum ist nun in seiner Ausgangsposition dargestellt, in der er sich auch zu Beginn des Zaubertricks befindet."
    },
    {
        datei: "Baum Phase 2.png",
        titel: "Phase 1: ",
        text: "Der Zaubertrick beginnt, und eine kleine Spieluhr setzt mit ihrer Melodie ein. Gleichzeitig sind am Orangenbaum acht kleine, gelbe Orangenblüten erschienen."
    },
    {
        datei: "Baum Phase 3.png",
        titel: "Phase 2: ",
        text: "Nachdem die Blüten gewachsen sind, kommen die Orangen zum Vorschein. Zuvor waren diese noch von einer Abdeckung verdeckt. Sobald sich diese hinter die Orangen bewegt, werden sie vollständig sichtbar. Insgesamt sind nun fünf Orangen am Baum zu sehen."
    },
    {
        datei: "Baum Phase 4.png",
        titel: "Phase 3: ",
        text: "Der Zaubertrick ist nun abgeschlossen und der Orangenbaum zeigt sich in seiner vollständigen Pracht. In der letzten Phase steigen auf der Rückseite des Baumes zwei Schmetterlinge empor, an denen ein weißes Taschentuch befestigt ist. An diesem befindet sich ein goldener Ring, der zu Beginn des Zaubertricks aus dem Publikum entnommen wurde und nun am Baum erscheint. Anschließend kann der Ring wieder an die entsprechende Person aus dem Publikum zurückgegeben werden."
    },
];

const aktivesBild   = document.getElementById("aktivesBild");
const bildTitel     = document.getElementById("bildTitel");
const bildText      = document.getElementById("bildText");
const tafelNr       = document.getElementById("tafelNr");
const filmstreifen  = document.getElementById("filmstreifen");
const galerieFehlt  = document.getElementById("galerieFehlt");
const btnZurueck    = document.getElementById("bildZurueck");
const btnVor        = document.getElementById("bildVor");

let aktiverIndex = 0;
let vorhandene   = [];


let geprueft = 0;

bilder.forEach((eintrag) => {
    const test = new Image();
    test.onload  = () => { eintrag._ok = true;  fertigGeprueft(); };
    test.onerror = () => { eintrag._ok = false; fertigGeprueft(); };
    test.src = "assets/fotos/" + eintrag.datei;
});

function fertigGeprueft() {
    geprueft++;
    if (geprueft < bilder.length) return;

    vorhandene = bilder.filter((b) => b._ok);

    if (vorhandene.length === 0) {
        galerieFehlt.classList.remove("versteckt");
        btnZurueck.classList.add("versteckt");
        btnVor.classList.add("versteckt");
        return;
    }
    baueFilmstreifen();
    zeige(0);
}

function baueFilmstreifen() {
    vorhandene.forEach((eintrag, i) => {
        const mini = document.createElement("img");
        mini.src = "assets/fotos/" + eintrag.datei;
        mini.alt = eintrag.titel;
        mini.loading = "lazy";
        mini.tabIndex = 0;
        mini.addEventListener("click", () => zeige(i));
        mini.addEventListener("keydown", (e) => { if (e.key === "Enter") zeige(i); });
        filmstreifen.appendChild(mini);
    });
}

function zeige(i) {
    aktiverIndex = (i + vorhandene.length) % vorhandene.length;
    const eintrag = vorhandene[aktiverIndex];

    aktivesBild.style.opacity = "0";
    setTimeout(() => {
        aktivesBild.src = "assets/fotos/" + eintrag.datei;
        aktivesBild.alt = eintrag.titel;
        aktivesBild.style.opacity = "1";
    }, 180);

    bildTitel.textContent = eintrag.titel;
    bildText.textContent  = eintrag.text;
    tafelNr.textContent   = "Tafel " + String(aktiverIndex + 1).padStart(2, "0")
                          + " / " + String(vorhandene.length).padStart(2, "0");


    [...filmstreifen.children].forEach((el, idx) => {
        el.classList.toggle("aktiv", idx === aktiverIndex);
    });
}

btnZurueck.addEventListener("click", () => zeige(aktiverIndex - 1));
btnVor.addEventListener("click", () => zeige(aktiverIndex + 1));
document.addEventListener("keydown", (e) => {
    if (overlay.classList.contains("versteckt")) {
        if (e.key === "ArrowLeft")  zeige(aktiverIndex - 1);
        if (e.key === "ArrowRight") zeige(aktiverIndex + 1);
    }
});


aktivesBild.addEventListener("click", () => {
    if (vorhandene.length) oeffneBild("assets/fotos/" + vorhandene[aktiverIndex].datei);
});

const overlay          = document.getElementById("overlay");
const overlaySchliessen = document.getElementById("overlaySchliessen");
const ovModell = document.getElementById("overlayModell");
const ovVideo  = document.getElementById("overlayVideo");
const ovBild   = document.getElementById("overlayBild");
const videoGross = document.getElementById("videoGross");
const overlayBildImg = document.getElementById("overlayBildImg");

function alleInhalteAus() {
    ovModell.classList.add("versteckt");
    ovVideo.classList.add("versteckt");
    ovBild.classList.add("versteckt");
}

function oeffneOverlay(welcher) {
    alleInhalteAus();
    welcher.classList.remove("versteckt");
    overlay.classList.remove("versteckt");
    document.body.style.overflow = "hidden";
}

function schliesseOverlay() {
    overlay.classList.add("versteckt");
    document.body.style.overflow = "";
    videoGross.pause();
}

function oeffneModell() { oeffneOverlay(ovModell); }
function oeffneVideoGross() {
    oeffneOverlay(ovVideo);
    videoGross.currentTime = 0;
    videoGross.play().catch(() => {});
}
function oeffneBild(quelle) {
    overlayBildImg.src = quelle;
    oeffneOverlay(ovBild);
}

overlaySchliessen.addEventListener("click", schliesseOverlay);
overlay.addEventListener("click", (e) => { if (e.target === overlay) schliesseOverlay(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") schliesseOverlay(); });


document.getElementById("modellOeffnen").addEventListener("click", oeffneModell);

const videoTafel   = document.getElementById("videoTafel");
const videoVorschau = document.getElementById("videoVorschau");
const videoFehlt   = document.getElementById("videoFehlt");

videoTafel.addEventListener("click", oeffneVideoGross);

function videoFehlerBehandeln() {
    videoFehlt.classList.remove("versteckt");
    videoVorschau.classList.add("versteckt");
    videoTafel.querySelector(".video-play").classList.add("versteckt");
    videoTafel.querySelector(".video-label").classList.add("versteckt");
    videoTafel.style.cursor = "default";
    videoTafel.onclick = null;
}
videoVorschau.addEventListener("error", videoFehlerBehandeln, true);
const vquelle = videoVorschau.querySelector("source");
if (vquelle) vquelle.addEventListener("error", videoFehlerBehandeln);

const viewerVorschau = document.getElementById("viewerVorschau");
const viewerGross    = document.getElementById("viewerGross");
const ansichtBtns    = document.querySelectorAll(".ansicht-btn");

ansichtBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const modell = btn.dataset.modell;

        if (viewerVorschau.getAttribute("src") !== modell) {
            viewerVorschau.setAttribute("src", modell);
        }
        if (viewerGross.getAttribute("src") !== modell) {
            viewerGross.setAttribute("src", modell);
        }

        ansichtBtns.forEach((b) => b.classList.remove("aktiv"));
        btn.classList.add("aktiv");
    });
});

