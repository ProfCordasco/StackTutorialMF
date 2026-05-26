document.addEventListener("DOMContentLoaded", function (){
    caricaCucce();
});

function caricaCucce() {
  const URL = "https://scuolaapi.altervista.org/BCK/get_cucce.php";
  //const URL = "https://scuolaapi.altervista.org/api/get_cucce.php";

  // Per ora inseriamo qui il session id manualmente.
  // Dopo la login useremo:
  // const sessionId = localStorage.getItem("session_id");

  const sessionId = "b0cce685c79fcd2c58ee354fa9d2cd8c2c6ecdebb3ea5a366fe9f84f18f8398f";

  fetch(URL, {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
        "X-Session-Id": sessionId
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (risposta) {

      console.log(risposta);

      if (risposta.success === true) {
        mostraCucce(risposta.data);
      } else {
        alert(risposta.errore);
      }

    })
    .catch(function (errore){
        console.log("errore", errore);
    })
}


function mostraCucce(cucce){
    const lista = document.getElementById("lista-cucce");

    lista.innerHTML = "";

    cucce.forEach(function( cuccia) {
        let classeBadge = "badge-libera";

        if(cuccia.stato_animale == 1) {
            classeBadge = "badge-occupata";
        }

        const umidita = cuccia.umidita ?? "-";
        const temperatura = cuccia.temperatura ?? "-";

        const statoAnimale = cuccia.stato_animale == 0 ? "Cuccia libera" : "Cuccia occupata";
        const statoPorta = cuccia.stato_porta == 0 ? "Porta aperta" : "Porta chiusa";
        const iconaPorta = cuccia.stato_porta == 0 ? "open" : "closed";

        lista.innerHTML += `
            <div class="col-md-6 col-xl-4">
                <div class="card card-custom h-100">
                <div class="card-body">

                    <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="card-title">${cuccia.nome}</h5>
                        <p class="text-muted mb-2">${cuccia.zona}</p>
                    </div>

                    <span class="badge ${classeBadge}">
                        ${statoAnimale}
                    </span>
                    </div>

                    <p class="mb-1"><i class="fa-solid fa-temperature-empty"></i> ${temperatura} °C</p>
                    <p class="mb-1"><i class="fa-solid fa-droplet"></i> ${umidita} %</p>
                    <p class="mb-3"><i class="fa-solid fa-door-${iconaPorta}"></i> Porta: ${statoPorta}</p>

                    <a href="cuccia.html?id=${cuccia.id}" class="btn btn-outline-primary btn-sm w-100">
                    Dettagli
                    </a>

                </div>
                </div>
            </div>
            `;
    });
}