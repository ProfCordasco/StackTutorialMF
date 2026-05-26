document.addEventListener("DOMContentLoaded", function (){
    caricaCucce();
});

function caricaCucce() {
    const URL = "https://scuolaapi.altervista.org/BCK/get_cucce.php";

  // Per ora inseriamo qui il session id manualmente.
  // Dopo la login useremo:
  // const sessionId = localStorage.getItem("session_id");

  const sessionId = "INSERISCI_QUI_IL_SESSION_ID";

  fetch(URL, {
    method: "GET",
    headers: {
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

        if(cuccia.stato_animale === 1) {
            classeBadge = "badge-occupata";
        }

        const statoAnimale = cuccia.stato_animale == 0 ? "Cuccia libera" : "Cuccia occupata";
        const statoPorta = cuccia.stato_porta == 0 ? "Porta aperta" : "Porta chiusa";

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

                    <p class="mb-1">🌡️ ${cuccia.temperatura} °C</p>
                    <p class="mb-1">💧 ${cuccia.umidita}%</p>
                    <p class="mb-3">🚪 Porta: ${statoPorta}</p>

                    <a href="cuccia.html?id=${cuccia.id}" class="btn btn-outline-primary btn-sm w-100">
                    Dettagli
                    </a>

                </div>
                </div>
            </div>
            `;
    });
}