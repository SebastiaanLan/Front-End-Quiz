const headerText = document.querySelector("#headerText")
const naamText = document.querySelector("#naamText");

const imgVraag = document.getElementById('imgVraag');

const startScherm = document.querySelector("#startScherm");
const keuzeScherm = document.querySelector("#keuzeScherm");
const quizScherm = document.querySelector("#quizScherm");
const eindScherm = document.querySelector("#eindScherm");

const knoppen = document.querySelectorAll(".knop");
const timer = document.querySelector("#timer")

const scoreboardElement = document.querySelector("#scoreboard");

let quizData = [];

let naam = "";
let keuze = "";

let tijd = 15;
let vraagCounter = 0;
let punten = 0;
let aantalVragen;
let interval;

let juisteAntwoord;
let juisteIndex;    
let huidigeVraag;
let opties;

let fouteAntwoorden = [];

function verwerkNaam() {
    naam = document.forms["form"]["name"].value;
    
    laadKeuzeScherm();
    return false;
}   

function laadKeuzeScherm() {
    headerText.textContent = `Hallo ${naam}, Welke quiz wil je spelen?`
    startScherm.style.display = "none";
    keuzeScherm.style.display = "flex"
}

function verwerkKeuze(input) {
    keuze = input;

    laadQuizScherm();
}

async function laadQuizScherm() {
    headerText.textContent = '';
    keuzeScherm.style.display = "none";
    quizScherm.style.display = "flex"

    naamText.textContent = naam
    
    quizData = await fetchJSON();
    aantalVragen = quizData.length;

    vraagCounter = 0;

    laadVolgendeVraag();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchJSON() {
    const response = await fetch("./JSON/" + keuze + "/data.json");
    return await response.json();
}


function laadVolgendeVraag() {
    clearInterval(interval);
    interval = null;

    huidigeVraag = quizData[vraagCounter];

    headerText.textContent = huidigeVraag.vraag;
    imgVraag.src = "./JSON/" + keuze + "/img/" + vraagCounter + ".jpg";

    opties = huidigeVraag.opties;
    juisteAntwoord = opties[0];

    opties = shuffleArray(opties);
    juisteIndex = opties.indexOf(juisteAntwoord);

    for (let i = 0; i < opties.length; i++) {
        knoppen[i].innerHTML = `<strong>${opties[i]}</strong`;
        knoppen[i].onclick = () => verwerkAntwoord(i);
    }

    tijd = 15;
    timer.textContent = tijd;

    interval = setInterval(() => {
        tijd--;
        timer.textContent = tijd;

        if (tijd <= 0) {
            verwerkAntwoord(4);
        }
    }, 1000);
}

function verwerkAntwoord(gegevenAntwoord) {
    if (gegevenAntwoord == juisteIndex) {
        punten++;
    } else {
        fouteAntwoorden.push({
            vraagNummer: vraagCounter + 1,
            vraag: quizData[vraagCounter].vraag,
            gegevenAntwoord: opties[gegevenAntwoord],
            juisteAntwoord: opties[juisteIndex]
        })
    }
    
    vraagCounter++;
    if (vraagCounter >= aantalVragen) {
        clearInterval(interval);
        laadEindScherm();
        return;
    }
    
    laadVolgendeVraag()
}

function updateScoreboard(naam, punten, categorie) {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || {};
    
    if (!scoreboard[categorie]) {
        scoreboard[categorie] = [];
    }
    
    scoreboard[categorie].push({
        naam: naam,
        punten: punten,
    });
    
    scoreboard[categorie].sort((a, b) => b.punten - a.punten);
    scoreboard[categorie] = scoreboard[categorie].slice(0, 3);
    
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
}

function toonScoreboard(categorie) {
    const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || {};
    const scoreboardLijst = scoreboard[categorie] || [];
    
    const scoreboardElement = document.querySelectorAll(".scoreboardList");
    
    for (let i = 0; i < scoreboardElement.length; i++) {
        scoreboardElement[i].textContent = scoreboardLijst[i] ? `${scoreboardLijst[i].naam} - ${scoreboardLijst[i].punten} punten` : 'Nog geen score';
    }
}

function laadEindScherm() {
    headerText.textContent = `Gefeliciteerd ${naam}, je hebt de quiz afgerond.`

    quizScherm.style.display = 'none';
    eindScherm.style.display = 'flex';

    const puntenOutput = document.querySelector("#puntenOutput");
    const maxPuntenOutput = document.querySelector("#maxPuntenOutput");

    puntenOutput.textContent = punten;
    maxPuntenOutput.textContent = aantalVragen;

    updateScoreboard(naam, punten, keuze);
    toonScoreboard(keuze);

    const fouteVragenElement = document.getElementById("fouteVragen");
    for (let i = 0; i < fouteAntwoorden.length; i++) {
        let fouteVraagElement = document.createElement("div");

        let vraagNummerElement = document.createElement("h4");
        vraagNummerElement.innerText = `Vraag ${fouteAntwoorden[i].vraagNummer}`;
        fouteVraagElement.appendChild(vraagNummerElement);

        let vraagElement = document.createElement("p");
        vraagElement.innerText = fouteAntwoorden[i].vraag;
        fouteVraagElement.appendChild(vraagElement);

        let gekozenAntwoordElement = document.createElement("p");
        if (fouteAntwoorden[i].gegevenAntwoord) {
            gekozenAntwoordElement.innerHTML = `<strong>Jouw antwoord:</strong> <span style="color: red;">${fouteAntwoorden[i].gegevenAntwoord}</span>`;
        } else {
            gekozenAntwoordElement.innerHTML = `<strong>Niet snel genoeg genoeg</span>`;
        } 
        
        fouteVraagElement.appendChild(gekozenAntwoordElement);

        let juisteAntwoordElement = document.createElement("p");
        juisteAntwoordElement.innerHTML = `<strong>Juiste antwoord:</strong> <span style="color: green;">${fouteAntwoorden[i].juisteAntwoord}</span>`;
        fouteVraagElement.appendChild(juisteAntwoordElement);

        fouteVragenElement.appendChild(fouteVraagElement);
    }
}

function laadStartScherm() {
    punten = 0;
    fouteVragenElement = [];

    eindScherm.style.display = "none"
    startScherm.style.display = "flex";
    headerText.textContent = "Quiz";
}