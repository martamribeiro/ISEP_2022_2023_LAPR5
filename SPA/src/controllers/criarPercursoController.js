export async function requestCriarPercurso(armazemPartida, armazemChegada, distancia, duracao, energiaGasta, tempoExtra){
    await fetch('http://localhost:3000/api/percursos/', {
            method: 'POST',
            body: JSON.stringify({
                "armazemPartida":armazemPartida,
                "armazemChegada":armazemChegada,
                "distancia": distancia,
                "duracao": duracao,
                "energiaGasta": energiaGasta,
                "tempoExtra": tempoExtra
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .catch(err => window.alert('Não foi possível criar o percurso. Verifique se os IDs dos Armazéns estão corretos e se já não existe nenhum percurso entre esses 2 Armazéns.'));


}