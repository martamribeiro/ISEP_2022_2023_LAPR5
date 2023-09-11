export async function requestListarCamiao(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    const response = await fetch("http://localhost:3000/api/camioes/camioesExistentes", requestOptions)
    const camioes = await response.json();

    return camioes;
}