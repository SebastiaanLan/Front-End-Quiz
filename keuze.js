const spelersNaam = sessionStorage.getItem("spelersNaam");
const naamOutput = document.getElementById("naamOutput");

naamOutput.textContent = spelersNaam;

function maakKeuze(quizKeuze) {
    sessionStorage.setItem("quizKeuze", quizKeuze);
}