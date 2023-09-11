export async function requestListarCamioesPorEstado(path){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/camioes" + path, requestOptions);
    const camioes = await response.json();

    return camioes;
}

export async function requestGetCamiaoPorNome(path){
    var getRequestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/camioes" + path, getRequestOptions)
    const camiao = await response.json();

    return camiao;
}

export async function requestEditarCamiaoEstadoDoCamiao(nomeCamiao, cargaTotalBaterias, tara, maximoCarga, autonomia, tempoCarregamento, matriculaCamiao, changedAtivoCamiao){
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const editedCamiaoInfo = JSON.stringify({
            "nomeCamiao": nomeCamiao,
            "cargaTotalBaterias": cargaTotalBaterias,
            "tara": tara,
            "maximoCarga": maximoCarga,
            "autonomia": autonomia,
            "tempoCarregamento": tempoCarregamento,
            "matriculaCamiao": matriculaCamiao,
            "ativoCamiao": changedAtivoCamiao
        });

        var putRequestOptions = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: editedCamiaoInfo,
            redirect: 'follow'
        };

        await fetch("http://localhost:3000/api/camioes", putRequestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch((error) => {window.alert("Camião não encontrado.")});
}