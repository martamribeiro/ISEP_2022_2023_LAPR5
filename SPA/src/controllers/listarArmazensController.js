export async function listArmazens(path) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    
    const response = await fetch("https://localhost:5001/api/Armazem" + path, requestOptions)

    if(response.status===200) {
        return await response.json();
    }
}

export async function inibirArmazens(idArmazemInput) {
    let path = '/' + idArmazemInput;

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    
    const response = await fetch("https://localhost:5001/api/Armazem" + path, requestOptions)

    if(response.status===200) {
        return await response.json();
    }
}