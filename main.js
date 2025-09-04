function checkNaam() {
    const naam = document.forms["form"]["name"].value;

    if (naam == "") {
        alert("Je moet nog je naam invullen");
        return false;
    }

    sessionStorage.setItem("spelersNaam", naam);
}