import { Service, Inject } from "typedi";
import fetch from 'node-fetch';
import http = require('http');
import IPlaneamentoRepo from "../services/IRepos/IPlaneamentoRepo";
import { Viagem } from "../domain/viagem";
import { IViagemPersistence } from "../dataschema/IViagemPersistence";
import { Document, FilterQuery, Model } from "mongoose";
import { ViagemMap } from "../mappers/ViagemMap";

@Service()
export default class PlaneamentoRepo implements IPlaneamentoRepo {
  private models: any;

  constructor(
    @Inject("viagemSchema")
    private viagemSchema: Model<IViagemPersistence & Document>
  ) {}

    private createBaseQuery (): any {
      return {
      where: {},
      }
    }


    httpAgent = new http.Agent({
      });

    public async findTrajMaisRapida(data: string, camiao: string): Promise<any[]> {

        const response = await fetch('http://localhost:5026/pedido_traj_rapida?data=' + data + '&camiao=' + camiao, {
        method: 'GET',
        agent: this.httpAgent,
        });
        
        return response.json();
    }

    public async findMelhorViagemHeuristicaArmazem(data: string, camiao: string): Promise<any[]> {

      const response = await fetch('http://localhost:5026/pedido_heuristica_armazem?data=' + data + '&camiao=' + camiao, {
      method: 'GET',
      agent: this.httpAgent,
      });
      
      return response.json();
    }

    public async findMelhorViagemHeuristicaEntrega(data: string, camiao: string): Promise<any[]> {

      const response = await fetch('http://localhost:5026/pedido_heuristica_entrega?data=' + data + '&camiao=' + camiao, {
      method: 'GET',
      agent: this.httpAgent,
      });
      
      return response.json();
    }

    public async findMelhorViagemHeuristicaTempoMassa(data: string, camiao: string): Promise<any[]> {

      const response = await fetch('http://localhost:5026/pedido_heuristica_tempo_massa?data=' + data + '&camiao=' + camiao, {
      method: 'GET',
      agent: this.httpAgent,
      });
      
      return response.json();
    }

    public async save(viagem: Viagem): Promise<Viagem> {
      const query = { domainId: viagem.id.toString() };
  
      const viagemDocument = await this.viagemSchema.findOne(query);
  
      try {
        if (viagemDocument === null) {
          const rawViagem: any = ViagemMap.toPersistence(viagem);
  
          const viagemCriada = await this.viagemSchema.create(rawViagem);
  
          return ViagemMap.toDomain(viagemCriada);
        } else {
          viagemDocument.id = viagem.id.toString();
          viagemDocument.camiao = viagem.camiao;
          viagemDocument.data = viagem.data;
          viagemDocument.armazens = viagem.armazens;
          viagemDocument.tempoViagem = viagem.tempoViagem.props.minutos;
  
          await viagemDocument.save();
  
          return viagem;
        }
      } catch (err) {
        throw err;
      }
    }

    public async findAll(): Promise<Viagem[]> {
      const viagemRecord = await this.viagemSchema.find();
        var listaViagens:Viagem[] =[];
        if( viagemRecord != null) {
            viagemRecord.forEach(async element => {
                listaViagens.push(await ViagemMap.toDomain(element));
            });
            return listaViagens;
        }
        else
            return null;
    }

    public obterPlaneamentoAlgoritmoSimulado(): string[] {
      const planeamentoSimulado: string[] = ['eTruck01*["1","9","8","3"]*566.40360169491522', 'eTruck02*["6","2","4","5"]*525.40360169491522', 'eTruck03*["11","17","14","6"]*525.40360169491522'];
      const planeamentoCamiao = new Array(planeamentoSimulado.length)
        .fill('')
        .map((_, i) => planeamentoSimulado.slice(i, (i + 1)));

      let planeamentoOrganizado: string[] = [];
      let dadosPlaneamento: string[];
      planeamentoCamiao.forEach((planeamento) => {
        dadosPlaneamento = planeamento.join().split("*");
        planeamentoOrganizado.push(...dadosPlaneamento)});


        return planeamentoOrganizado;
    }

    
    public async obterPlaneamentoAlgoritmoGenetico(data: string): Promise<any[]> {

      const response = await fetch('http://localhost:5026/pedido_algoritmo_genetico?data=' + data, {
      method: 'GET',
      agent: this.httpAgent,
      });
      
      return response.json();
  }

    
}