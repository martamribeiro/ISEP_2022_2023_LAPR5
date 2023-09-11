export async function requestCancelarConta(username){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": username
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/utilizadores/cancelarConta", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch((error) => {window.alert("Erro ao cancelar a conta. Verifique os dados inseridos.")})
    
}