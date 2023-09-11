import { Result } from "../core/logic/Result";
import IPlaneamentoService from "./IServices/IPlaneamentoService";
import {Service, Inject} from 'typedi';
import config from '../../config';
import { Viagem } from "../domain/viagem";
import { TempoPercurso } from "../domain/tempoPercurso";
import { NomeCamiao } from "../domain/nomeCamiao";
import IViagemDTO from "../dto/IViagemDTO";
import { ViagemMap } from "../mappers/ViagemMap";


@Service()
export default class PlaneamentoService implements IPlaneamentoService {

    constructor(
        @Inject(config.repos.planeamento.name) private planeamentoRepo
    ) {}

    public async obterPlaneamento(data: string, camiao: string): Promise<Result<IViagemDTO>> {
        try {

            const viagemMaisRapida: any[] = await this.planeamentoRepo.findTrajMaisRapida(data,camiao);
            
            const tempoViagem = await TempoPercurso.create(viagemMaisRapida[0]).getValue();

            const viagemOrError = await Viagem.create({
              tempoViagem: tempoViagem,
              camiao: camiao,
              data: data,
              armazens: viagemMaisRapida[1],
            });
      
            if (viagemOrError.isFailure) {
              return Result.fail<IViagemDTO>(viagemOrError.errorValue());
            }
      
            const viagemResult = viagemOrError.getValue();
      
            await this.planeamentoRepo.save(viagemResult);
      
            const viagemDTOResult = ViagemMap.toDTO(viagemResult) as IViagemDTO;
            return Result.ok<IViagemDTO>(viagemDTOResult);

          } catch (e) {
            throw e;
          }
    }

    public async obterPlaneamentoHeuristicaArmazem(data: string, camiao: string): Promise<Result<IViagemDTO>> {
      try {

          const viagemMelhor: any[] = await this.planeamentoRepo.findMelhorViagemHeuristicaArmazem(data,camiao);
          
          const tempoViagem = await TempoPercurso.create(viagemMelhor[0]).getValue();

            const viagemOrError = await Viagem.create({
              tempoViagem: tempoViagem,
              camiao: camiao,
              data: data,
              armazens: viagemMelhor[1],
            });
      
            if (viagemOrError.isFailure) {
              return Result.fail<IViagemDTO>(viagemOrError.errorValue());
            }
      
            const viagemResult = viagemOrError.getValue();
      
            await this.planeamentoRepo.save(viagemResult);
      
            const viagemDTOResult = ViagemMap.toDTO(viagemResult) as IViagemDTO;
            return Result.ok<IViagemDTO>(viagemDTOResult);

        } catch (e) {
          throw e;
        }
    }

    public async obterPlaneamentoHeuristicaEntrega(data: string, camiao: string): Promise<Result<IViagemDTO>> {
      try {

          const viagemMelhor: any[] = await this.planeamentoRepo.findMelhorViagemHeuristicaEntrega(data,camiao);
          
          const tempoViagem = await TempoPercurso.create(viagemMelhor[0]).getValue();

            const viagemOrError = await Viagem.create({
              tempoViagem: tempoViagem,
              camiao: camiao,
              data: data,
              armazens: viagemMelhor[1],
            });
      
            if (viagemOrError.isFailure) {
              return Result.fail<IViagemDTO>(viagemOrError.errorValue());
            }
      
            const viagemResult = viagemOrError.getValue();
      
            await this.planeamentoRepo.save(viagemResult);
      
            const viagemDTOResult = ViagemMap.toDTO(viagemResult) as IViagemDTO;
            return Result.ok<IViagemDTO>(viagemDTOResult);

        } catch (e) {
          throw e;
        }
    }

    public async obterPlaneamentoHeuristicaTempoMassa(data: string, camiao: string): Promise<Result<IViagemDTO>> {
      try {

        const viagemMelhor: any[] = await this.planeamentoRepo.findMelhorViagemHeuristicaTempoMassa(data,camiao);
        
        const tempoViagem = await TempoPercurso.create(viagemMelhor[0]).getValue();

            const viagemOrError = await Viagem.create({
              tempoViagem: tempoViagem,
              camiao: camiao,
              data: data,
              armazens: viagemMelhor[1],
            });
      
            if (viagemOrError.isFailure) {
              return Result.fail<IViagemDTO>(viagemOrError.errorValue());
            }
      
            const viagemResult = viagemOrError.getValue();
      
            await this.planeamentoRepo.save(viagemResult);
      
            const viagemDTOResult = ViagemMap.toDTO(viagemResult) as IViagemDTO;
            return Result.ok<IViagemDTO>(viagemDTOResult);

      } catch (e) {
        throw e;
      }
    }

    public async obterPlaneamentoAlgoritmoSimulado(data: string): Promise<Result<IViagemDTO[]>> {
      try {
            
            const planeamentoOrganizado: string[] = this.planeamentoRepo.obterPlaneamentoAlgoritmoSimulado();

            let viagensDTO: IViagemDTO[] = [];
            let viagemDTOResult;

            for (let i = 0; i < planeamentoOrganizado.length; i = i+3) { 

              const tempoViagem = await TempoPercurso.create(Number(planeamentoOrganizado[i+2])).getValue();

              const viagemOrError = await Viagem.create({
                tempoViagem: tempoViagem,
                camiao: planeamentoOrganizado[i],
                data: data,
                armazens: JSON.parse(planeamentoOrganizado[i+1]),
              });
        
              if (viagemOrError.isFailure) {
                return Result.fail<IViagemDTO[]>(viagemOrError.errorValue());
              }
        
              const viagemResult = viagemOrError.getValue();
        
              await this.planeamentoRepo.save(viagemResult);
        
              viagemDTOResult = ViagemMap.toDTO(viagemResult) as IViagemDTO;
              viagensDTO.push(viagemDTOResult);
            }

            return Result.ok<IViagemDTO[]>(viagensDTO);

      } catch (e) {
        throw e;
      }
    }

    public async listarViagens(): Promise<Result<IViagemDTO[]>> {
      let viagensDTO: IViagemDTO[] = [];
  
      const viagens = await this.planeamentoRepo.findAll();
      viagens.forEach( (viagem) => {
          viagensDTO.push(ViagemMap.toDTO(viagem));
      });
  
      return Result.ok<IViagemDTO[]>(viagensDTO);
    }

    public async obterPlaneamentoAlgoritmoGenetico(data: string): Promise<Result<IViagemDTO[]>> {
      try {

            const planeamentoAlgGenetico: any[] = await this.planeamentoRepo.obterPlaneamentoAlgoritmoGenetico(data);
            const divisaoEntregas = planeamentoAlgGenetico[2];

            const res = [];
            for (let i = 0; i < planeamentoAlgGenetico[1].length; i += divisaoEntregas) {
              const chunk = planeamentoAlgGenetico[1].slice(i, i + divisaoEntregas);
              res.push(chunk);
            }
            
            let viagensDTO: IViagemDTO[] = [];
            let viagemDTOResult;

            for (let i = 0; i < planeamentoAlgGenetico[1].length / divisaoEntregas; i++) { 

              const camiao = "eTruck" + (i+1);
              const tempoViagem = await TempoPercurso.create(Number(1595.4141)).getValue();

              const viagemOrError = await Viagem.create({
                tempoViagem: tempoViagem,
                camiao: camiao,
                data: data,
                armazens: res[i],
              });
        
              if (viagemOrError.isFailure) {
                return Result.fail<IViagemDTO[]>(viagemOrError.errorValue());
              }
        
              const viagemResult = viagemOrError.getValue();
        
              await this.planeamentoRepo.save(viagemResult);
        
              viagemDTOResult = ViagemMap.toDTO(viagemResult) as IViagemDTO;
              viagensDTO.push(viagemDTOResult);
            }

            return Result.ok<IViagemDTO[]>(viagensDTO);

      } catch (e) {
        throw e;
      }
    }

    
}