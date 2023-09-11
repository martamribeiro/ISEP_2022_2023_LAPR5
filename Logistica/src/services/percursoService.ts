import { Service, Inject } from 'typedi';
import config from "../../config";
import IPercursoDTO from '../dto/IPercursoDTO';
import { Percurso } from "../domain/percurso";
import IPercursoRepo from '../services/IRepos/IPercursoRepo';
import IPercursoService from './IServices/IPercursoService';
import { Result } from "../core/logic/Result";
import { PercursoMap } from "../mappers/PercursoMap";
import { Distancia } from '../domain/distancia';
import { TempoPercurso } from '../domain/tempoPercurso';
import { Energia } from '../domain/energia';
import https = require('https');

@Service()
export default class PercursoService implements IPercursoService {
  constructor(
      @Inject(config.repos.percurso.name) private percursoRepo : IPercursoRepo,
      @Inject(config.repos.armazem.name) private armazemRepo
  ) {}

  httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  
  
  public async listarPercursosPorArmazemPartida(armazemPartida: string): Promise<Result<IPercursoDTO[]>> {
    let percursosDTO: IPercursoDTO[] = [];

    const percursos = await this.percursoRepo.findByArmazemPartida(armazemPartida);
    percursos.forEach( (percurso) => {
        percursosDTO.push(PercursoMap.toDTO(percurso));
    });

    return Result.ok<IPercursoDTO[]>(percursosDTO);
  }

  public async listarPercursosPorArmazemChegada(armChegada: string): Promise<Result<IPercursoDTO[]>> {
    let percursosDTO: IPercursoDTO[] = [];

    const percursos = await this.percursoRepo.findByArmazemChegada(armChegada);
    percursos.forEach( (percurso) => {
        percursosDTO.push(PercursoMap.toDTO(percurso));
    });

    return Result.ok<IPercursoDTO[]>(percursosDTO);
  }

  
  public async listarPercursos(): Promise<Result<IPercursoDTO[]>> {
    let percursosDTO: IPercursoDTO[] = [];

    const percursos = await this.percursoRepo.findAll();
    percursos.forEach( (percurso) => {
        percursosDTO.push(PercursoMap.toDTO(percurso));
    });

    return Result.ok<IPercursoDTO[]>(percursosDTO);
  }

  public async criarPercurso(percursoDTO: IPercursoDTO): Promise<Result<IPercursoDTO>> {
    try {

        const percurso = await this.percursoRepo.findByArmPartidaEChegada(percursoDTO.armazemPartida, percursoDTO.armazemChegada);

        if(percurso !== null) {
          return Result.fail<IPercursoDTO>("Percurso with that Arrival and Departure Warehouse already exists!");
        }
       
        const armazens: any[] = await this.armazemRepo.findAll();

        let existeArmazemPartida = await this.existeArmazem(armazens, percursoDTO.armazemPartida);
        let existeArmazemChegada = await this.existeArmazem(armazens, percursoDTO.armazemChegada);

        if(existeArmazemPartida == true && existeArmazemChegada == true) {
          
          const percursoOrError = await Percurso.create( percursoDTO );
  
          if (percursoOrError.isFailure) {
            return Result.fail<IPercursoDTO>(percursoOrError.errorValue());
          }
    
          const percursoResult = percursoOrError.getValue();
    
          await this.percursoRepo.save(percursoResult);
    
          const percursoDTOResult = PercursoMap.toDTO( percursoResult ) as IPercursoDTO;
          return Result.ok<IPercursoDTO>( percursoDTOResult )
        }

        return Result.fail<IPercursoDTO>("The Warehouses must exist in our system!");
      } catch (e) {
        throw e;
      }
  }

  private async existeArmazem(result: any[], armazem: string): Promise<Boolean> {
       
    let condition = false;

    result.forEach( (element) => {
      if (armazem == element.id){
          condition = true;
      }
    });
    return condition;
  }

  public async editarPercurso(armazemPartida: string, armazemChegada: string, distancia: number, duracao: number, energiaGasta: number, tempoExtra: number): Promise<Result<IPercursoDTO>> {
    try {
      const percurso = await this.percursoRepo.findByArmPartidaEChegada(armazemPartida, armazemChegada);

      if (percurso === null) {
        return Result.fail<IPercursoDTO>("Percurso not found");
      }
      else {

        percurso.props.distancia = await Distancia.create(distancia).getValue();
        percurso.props.duracao = await TempoPercurso.create(duracao).getValue();
        percurso.props.energiaGasta = await Energia.create(energiaGasta).getValue();
        percurso.props.tempoExtra = await TempoPercurso.create(tempoExtra).getValue();

        await this.percursoRepo.save(percurso);

        const percursoDTOResult = PercursoMap.toDTO( percurso ) as IPercursoDTO;
        return Result.ok<IPercursoDTO>( percursoDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async listarPercursosPorArmPartidaEChegada(armPartida: string, armChegada: string): Promise<Result<IPercursoDTO>> {
    try {
      const percurso = await this.percursoRepo.findByArmPartidaEChegada(armPartida, armChegada);

      if (percurso === null) {
        return Result.fail<IPercursoDTO>("Percurso not found");
      }
      else {
        const percursoDTOResult = PercursoMap.toDTO( percurso ) as IPercursoDTO;
        return Result.ok<IPercursoDTO>( percursoDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}

 