const naamOutput = document.getElementById("naamOutput");
const puntenOutput = document.getElementById("puntenOutput");
const maxPuntenOutput = document.getElementById("maxPuntenOutput");

const naam = sessionStorage.getItem("spelersNaam");
const punten = sessionStorage.getItem("punten");
const maxPunten = sessionStorage.getItem("maxPunten");

naamOutput.innerText = naam;
puntenOutput.innerText = punten;
maxPuntenOutput.innerText = maxPunten;