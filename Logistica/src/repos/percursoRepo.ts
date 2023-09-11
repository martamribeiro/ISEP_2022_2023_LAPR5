import { Service, Inject } from 'typedi';

import IPercursoRepo from "../services/IRepos/IPercursoRepo";
import { Percurso } from "../domain/percurso";
import { PercursoId } from "../domain/percursoId";
import { PercursoMap } from "../mappers/PercursoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPercursoPersistence } from '../dataschema/IPercursoPersistence';

@Service()
export default class PercursoRepo implements IPercursoRepo {
    private models: any;

    constructor(
        @Inject('percursoSchema') private percursoSchema : Model<IPercursoPersistence & Document>,
      ) {}

    private createBaseQuery (): any {
        return {
        where: {},
        }
    }

    public async exists(percurso: Percurso): Promise<boolean> {
    
        const idX = percurso.id instanceof PercursoId ? (<PercursoId>percurso.id).id : percurso.id;
    
        const query = { domainId: idX}; 
        const percursoDocument = await this.percursoSchema.findOne( query as FilterQuery<IPercursoPersistence & Document>);
    
        return !!percursoDocument === true;
    }

    public async save (percurso: Percurso): Promise<Percurso> {
        const query = { domainId: percurso.id.toString()}; 
    
        const percursoDocument = await this.percursoSchema.findOne( query );
    
        try {
          if (percursoDocument === null ) {
            const rawPercurso: any = PercursoMap.toPersistence(percurso);
    
            const percursoCreated = await this.percursoSchema.create(rawPercurso);
    
            return PercursoMap.toDomain(percursoCreated);
          } else {
            percursoDocument.id = percurso.id.toString();
            percursoDocument.armazemPartida = percurso.armazemPartida.props.armazemId;
            percursoDocument.armazemChegada = percurso.armazemChegada.props.armazemId;
            percursoDocument.distancia = percurso.distancia.km;
            percursoDocument.duracao = percurso.duracao.minutos;
            percursoDocument.energiaGasta = percurso.energiaGasta.kWh;
            percursoDocument.tempoExtra = percurso.tempoExtra.minutos;

            await percursoDocument.save();
    
            return percurso;
          }
        } catch (err) {
          throw err;
        }
    }

    public async findByDomainId (percursoId: PercursoId | string): Promise<Percurso> {
        const query = { domainId: percursoId};
        const percursoRecord = await this.percursoSchema.findOne( query as FilterQuery<IPercursoPersistence & Document> );

        if( percursoRecord != null) {
            return PercursoMap.toDomain(percursoRecord);
        }
        else
            return null;
    }

    public async findAll(): Promise<Percurso[]> {
      const percursoRecord = await this.percursoSchema.find();
        var listaPercursos:Percurso[] =[];
        if( percursoRecord != null) {
            percursoRecord.forEach(async element => {
                listaPercursos.push(await PercursoMap.toDomain(element));
            });
            return listaPercursos;
        }
        else
            return null;
    }

    public async findByArmazemPartida(armPartida: string): Promise<Percurso[]> {
      const query = { armazemPartida: armPartida};
      const percursosRecord = await this.percursoSchema.find(query as FilterQuery<IPercursoPersistence & Document>);
      if (percursosRecord != null) {
          let array: Percurso[] = [];
          percursosRecord.forEach( (percurso) => {
              array.push(PercursoMap.toDomain(percurso));
          });
          return array;
      } else return null;
    }

    public async findByArmazemChegada(armChegada: string): Promise<Percurso[]> {
      const query = { armazemChegada: armChegada};
      const percursosRecord = await this.percursoSchema.find(query as FilterQuery<IPercursoPersistence & Document>);
      if (percursosRecord != null) {
          let array: Percurso[] = [];
          percursosRecord.forEach( (percurso) => {
              array.push(PercursoMap.toDomain(percurso));
          });
          return array;
      } else return null;
    }

    public async findByArmPartidaEChegada(armPartida: string, armChegada: string): Promise<Percurso> {
      const query = { armazemPartida: armPartida, armazemChegada: armChegada};
      const percursoRecord = await this.percursoSchema.findOne( query as FilterQuery<IPercursoPersistence & Document> );

        if( percursoRecord != null) {
            return PercursoMap.toDomain(percursoRecord);
        }
        else
            return null;
    }




    


}