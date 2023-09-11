export async function requestDecodeToken(token, validUserRole){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    const pathDecodeToken = "/decodeToken/" + token;
    
    const responseDecodeToken = await fetch("http://localhost:3000/api/utilizadores" + pathDecodeToken, requestOptions);
    const decodedToken = await responseDecodeToken.json();

    if(decodedToken === null){
        return false;
    }else{
        let mapDecodedToken = new Map(Object.entries(decodedToken));

        let funcaoUtilizador = mapDecodedToken.get('funcao');
        
        let validSessionBoolean = await isValidSession(funcaoUtilizador, validUserRole);
    
        return validSessionBoolean;
    }
}

export async function isValidSession(funcaoUtilizador, validUserRole){
    return funcaoUtilizador === validUserRole ? true : false;
}

export async function requestDecodeTokenUsername(token){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    const pathDecodeToken = "/decodeToken/" + token;
    
    const responseDecodeToken = await fetch("http://localhost:3000/api/utilizadores" + pathDecodeToken, requestOptions);
    const decodedToken = await responseDecodeToken.json();

    if(decodedToken === null){
        return false;
    }else{
        let mapDecodedToken = new Map(Object.entries(decodedToken));

        let usernameUtilizador = mapDecodedToken.get('username');
        
        return usernameUtilizador;
    }
}