import { Service, Inject } from 'typedi';
import config from "../../config";
import ICamiaoDTO from '../dto/ICamiaoDTO';
import { Camiao } from '../domain/camiao';
import ICamiaoRepo from './IRepos/ICamiaoRepo';
import ICamiaoService from './IServices/ICamiaoService';
import { Result } from "../core/logic/Result";
import { CamiaoMap } from '../mappers/CamiaoMap';
import { Autonomia } from '../domain/autonomia';
import { Energia } from '../domain/energia';
import { MassaCamiao } from '../domain/massaCamiao';
import { TempoCarregamentoBateria } from '../domain/tempoCarregamentoBateria';
import { MatriculaCamiao } from '../domain/matriculaCamiao';
import { NomeCamiao } from '../domain/nomeCamiao';
import { AtivoCamiao } from '../domain/ativoCamiao';

@Service()
export default class CamiaoService implements ICamiaoService{
    constructor(
        @Inject(config.repos.camiao.name) private camiaoRepo: ICamiaoRepo
    ){}

    public async criarCamiao(camiaoDTO: ICamiaoDTO): Promise<Result<ICamiaoDTO>> {
        try{
            const camiaoOuErro = await Camiao.create(camiaoDTO);

            if(camiaoOuErro.isFailure){
                return Result.fail<ICamiaoDTO>(camiaoOuErro.getValue());
            }

            const camiaoResult = camiaoOuErro.getValue();

            await this.camiaoRepo.save(camiaoResult);

            const camiaoDTOResult = CamiaoMap.toDTO(camiaoResult) as ICamiaoDTO;

            return Result.ok<ICamiaoDTO>(camiaoDTOResult);
        }catch(e){
            throw e;
        }
    }

    public async editarCamiao(nomeCamiao: string, cargaTotalBaterias: number, tara: number, maximoCarga: number, autonomia: number, tempoCarregamento: number, matriculaCamiao: string, ativoCamiao: Boolean): Promise<Result<ICamiaoDTO>> {
        try{
            const camiao = await this.camiaoRepo.findByDomainId(nomeCamiao);

            if(camiao === null){
                return Result.fail<ICamiaoDTO>("Camião não encontrado");
            }else{
                camiao.props.autonomia = new Autonomia({km: autonomia});
                camiao.props.cargaTotalBaterias = new Energia({kWh: cargaTotalBaterias});
                camiao.props.maximoCarga = new MassaCamiao({kg: maximoCarga});
                camiao.props.tara = new MassaCamiao({kg: tara});
                camiao.props.tempoCarregamento = new TempoCarregamentoBateria({minutos: tempoCarregamento});
                camiao.props.ativoCamiao = new AtivoCamiao({ativoCamiao: ativoCamiao})

                await this.camiaoRepo.save(camiao);

                const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;

                return Result.ok<ICamiaoDTO>(camiaoDTOResult);
            }
        }catch(e){
            throw e;
        }
    }

    public async listarCamioes(): Promise<Result<ICamiaoDTO[]>> {
        let listaCamioes: ICamiaoDTO[] = [];

        const camioes = await this.camiaoRepo.findAll();

        camioes.forEach((camiao) => {
            listaCamioes.push(CamiaoMap.toDTO(camiao));
        });

        return Result.ok<ICamiaoDTO[]>(listaCamioes);
    }

    public async listarCamioesAtivos(ativoCamiao: Boolean): Promise<Result<ICamiaoDTO[]>> {
        let listaCamioesAtivos: ICamiaoDTO[] = [];

        const camioesAtivos = await this.camiaoRepo.findByAllActiveStatus(ativoCamiao);

        camioesAtivos.forEach((camiao) => {
            listaCamioesAtivos.push(CamiaoMap.toDTO(camiao));
        });

        return Result.ok<ICamiaoDTO[]>(listaCamioesAtivos);
    }

    public async listarCamioesDesativos(ativoCamiao: Boolean): Promise<Result<ICamiaoDTO[]>> {
        let listaCamioesDesativos: ICamiaoDTO[] = [];

        const camioesDesativos = await this.camiaoRepo.findByAllActiveStatus(ativoCamiao);

        camioesDesativos.forEach((camiao) => {
            listaCamioesDesativos.push(CamiaoMap.toDTO(camiao));
        });

        return Result.ok<ICamiaoDTO[]>(listaCamioesDesativos);
    }

    public async getCamiaoPorNome(nomeCamiao: string): Promise<Result<ICamiaoDTO>> {
        const camiao = await this.camiaoRepo.findByDomainId(nomeCamiao);

        const camiaoDTO = CamiaoMap.toDTO(camiao) as ICamiaoDTO;

        return Result.ok<ICamiaoDTO>(camiaoDTO);
    }
}