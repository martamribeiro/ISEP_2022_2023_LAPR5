export async function requestListarPercurso(path){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:3000/api/percursos" + path, requestOptions)
    const percursos = await response.json();

    return percursos;

}