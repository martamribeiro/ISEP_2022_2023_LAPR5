export default interface ICamiaoDTO{
    id: string;
    nomeCamiao: string;
    cargaTotalBaterias: number;
    tara: number;
    maximoCarga: number;
    autonomia: number;
    tempoCarregamento: number;
    matriculaCamiao: string;
    ativoCamiao: Boolean;
}