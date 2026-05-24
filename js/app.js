const API_URL = "";

function getJSON(file) {
    return fetch(API_URL+ file)
        .then(function(response){
            
            if(!response.ok) {
                console.log(response);
            }

            return response.json();
        });
}