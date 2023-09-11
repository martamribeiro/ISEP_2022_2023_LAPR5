export async function criarArmazens(armazemInfo) {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: armazemInfo,
        redirect: 'follow'
    };

    
    const response = await fetch("https://localhost:5001/api/Armazem", requestOptions)

    if(response.status===200) {
        return await response.json();
    }

}