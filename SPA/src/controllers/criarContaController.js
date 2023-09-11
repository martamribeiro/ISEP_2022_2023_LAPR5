export async function requestCriarUtilizador(username, email, primeiroNome, ultimoNome, password, numeroTelefone, funcaoUtilizador){
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const utilizadorInfo = JSON.stringify({
            "username": username,
            "email": email,
            "primeiroNome": primeiroNome,
            "ultimoNome": ultimoNome,
            "password": password,
            "numeroTelefone": numeroTelefone,
            "funcaoUtilizador": funcaoUtilizador
        });

        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: utilizadorInfo,
            redirect: 'follow'
        };

        await fetch("http://localhost:3000/api/utilizadores", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch((error) => {window.alert("Este Utilizador já existe.")})
        
}