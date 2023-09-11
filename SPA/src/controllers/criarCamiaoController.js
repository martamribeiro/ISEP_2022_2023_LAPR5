export async function requestCriarCamiao(nomeCamiao, cargaTotalBaterias, tara, maximoCarga, autonomia, tempoCarregamento, matriculaCamiao, ativoCamiao){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const camiaoInfo = JSON.stringify({
        "nomeCamiao": nomeCamiao,
        "cargaTotalBaterias": cargaTotalBaterias,
        "tara": tara,
        "maximoCarga": maximoCarga,
        "autonomia": autonomia,
        "tempoCarregamento": tempoCarregamento,
        "matriculaCamiao": matriculaCamiao,
        "ativoCamiao": ativoCamiao
    });

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: camiaoInfo,
        redirect: 'follow'
    };

    await fetch("http://localhost:3000/api/camioes", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(err => console.log(err));
    
    window.location.reload();        
}