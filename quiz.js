const textVraag = document.getElementById("vraag");
const knoppen = document.getElementsByClassName("knop");

const keuze = sessionStorage.getItem("quizKeuze");

let vraagCounter = 0;
let punten = 0;
let aantalVragen;

async function fetchJSON() {
    const response = await fetch("./JSON/" + keuze + ".json");
    return await response.json();
}


async function laadVolgendeVraag() {
    const quiz = await fetchJSON().catch(
        
    );
    aantalVragen = quiz.length

    textVraag.textContent = quiz[vraagCounter].vraag;

    let antwoorden = quiz[vraagCounter].opties;
    for (let antwoord in antwoorden) {
        knoppen[antwoord].innerText = antwoorden[antwoord];
    }
}

function verwerkAntwoord(gegevenAntwoord) {
    if (gegevenAntwoord == 0) {
        punten++;
    } else {
        punten--;
    }

    vraagCounter++;
    if (vraagCounter >= aantalVragen) {
        sessionStorage.setItem("punten", punten);
        sessionStorage.setItem("maxPunten", aantalVragen);

        window.location.href = "eind.html";
    }
    
    laadVolgendeVraag()
}

laadVolgendeVraag();