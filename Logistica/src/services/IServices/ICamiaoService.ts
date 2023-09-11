import { Result } from "../../core/logic/Result";
import ICamiaoDTO from "../../dto/ICamiaoDTO";

export default interface ICamiaoService{
    criarCamiao(camiaoDTO: ICamiaoDTO): Promise<Result<ICamiaoDTO>>;
    editarCamiao(nomeCamiao: string, cargaTotalBaterias: number, tara: number, maximoCarga: number, autonomia: number, tempoCarregamento: number, matriculaCamiao: string, ativoCamiao: Boolean): Promise<Result<ICamiaoDTO>>;
    listarCamioes(): Promise<Result<ICamiaoDTO[]>>;
    listarCamioesAtivos(ativoCamiao: Boolean): Promise<Result<ICamiaoDTO[]>>;
    listarCamioesDesativos(ativoCamiao: Boolean): Promise<Result<ICamiaoDTO[]>>;
    getCamiaoPorNome(nomeCamiao: string): Promise<Result<ICamiaoDTO>>;
}