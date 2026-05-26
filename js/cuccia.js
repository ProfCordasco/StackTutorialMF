document.addEventListener("DOMContentLoaded", function () {

    // Legge ID dalla URL
    const parametri = new URLSearchParams(window.location.search);
    const idCuccia = parametri.get("id");
    caricaCuccia(idCuccia);
  
  });
  
  
  function caricaCuccia(id) {
  
    const URL = "https://scuolaapi.altervista.org/BCK/get_cuccia.php?id="+id;
    //const URL = "https://scuolaapi.altervista.org/spi/get_cuccia.php?id="+id;

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
        mostraCuccia(risposta.data);
      } else {
        document.getElementById("dettaglio-cuccia").innerHTML = `
            <div class="alert alert-danger">
              Cuccia non trovata
            </div>
          `;
      }

    });
  
  }
  
  function mostraCuccia(cuccia) {
  
    const contenitore = document.getElementById("dettaglio-cuccia");
  
    // Badge stato animale
    let badgeAnimale = `
      <span class="cuccia-badge badge badge-libera">
        LIBERA
      </span>
    `;
  
    if (cuccia.stato_animale == 1) {
  
      badgeAnimale = `
        <span class="cuccia-badge badge badge-occupata">
          OCCUPATA
        </span>
      `;
  
    }
  
    // Stato porta
    let statoPorta = "APERTA";
    if (cuccia.stato_porta == 1) {
      statoPorta = "CHIUSA";
    }


    const umidita = cuccia.umidita ?? "-";
    const temperatura = cuccia.temperatura ?? "-";
    const iconaPorta = cuccia.stato_porta == 0 ? "open" : "closed";
  
    contenitore.innerHTML = `
    <div class="mb-3">

        <a href="dashboard.html" class="btn btn-outline-secondary">
        ← Torna alla dashboard
        </a>

    </div>
      <div class="card card-custom">
        <div class="card-body">
          <!-- HEADER -->
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 class="card-title">
                ${cuccia.nome}
              </h2>
  
              <p class="text-muted">
                ${cuccia.zona}
              </p>
  
            </div>
            ${badgeAnimale}
          </div>
  
          <!-- DATI -->
          <div class="row g-3">
            <div class="col-md-6">
              <div class="border rounded p-3">
                <h6><i class="fa-solid fa-temperature-empty"></i> Temperatura</h6>
                <h3>
                  ${temperatura} °C
                </h3>
              </div>
            </div>
  
            <div class="col-md-6">
              <div class="border rounded p-3">
                <h6><i class="fa-solid fa-droplet"></i> Umidità</h6>
                <h3>
                  ${umidita} %
                </h3>
              </div>
            </div>
  
            <div class="col-md-6">
              <div class="border rounded p-3">
                <h6><i class="fa-solid fa-door-${iconaPorta}"></i> Stato porta</h6>
                <h3>
                  ${statoPorta}
                </h3>
              </div>
            </div>
  
            <div class="col-md-6">
              <div class="border rounded p-3 h-100">
                <h6><i class="fa-regular fa-clock"></i> Ultimo aggiornamento</h6>
                <p class="mb-0">
                  ${cuccia.ultimo_aggiornamento}
                </p>
              </div>
            </div>
          </div>
  
          <!-- BOTTONI -->
          <div class="mt-4 d-flex gap-2">
            <button
              class="btn btn-success"
              onclick="apriPorta(${cuccia.id})">
              Apri porta
            </button>
  
            <button
              class="btn btn-danger"
              onclick="chiudiPorta(${cuccia.id})">
              Chiudi porta
            </button>
          </div>
        </div>
      </div>
    `;
  
  }
  
  function apriPorta(id) {
    chiamaComandoPorta(id, 0);
  }
  
  function chiudiPorta(id) {
    chiamaComandoPorta(id, 1);
  }

  function chiamaComandoPorta(id, statoPorta){
    const URL = "https://scuolaapi.altervista.org/BCK/comando_porta.php";
    //const URL = "https://scuolaapi.altervista.org/api/comando_porta.php";

    // Per ora inseriamo qui il session id manualmente.
    // Dopo la login useremo:
    // const sessionId = localStorage.getItem("session_id");

    const sessionId = "b0cce685c79fcd2c58ee354fa9d2cd8c2c6ecdebb3ea5a366fe9f84f18f8398f";

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "X-Session-Id": sessionId
        },
        body: JSON.stringify({
            id_cuccia: id,
            stato_porta: statoPorta
        })
    })
    .then(function(response){
        return response.json();
    })
    .then(function(risposta){
        console.log(risposta);

        if(risposta.success === true){
            alert("Comando eseguito correttamente");

            caricaCuccia(id);
        }
        else {
            alert(risposta.message);
        }
    }).catch(function(errore){
        console.log("Errore: "+errore);
        alert("Errore durante l'invio del comando");
    });


  }