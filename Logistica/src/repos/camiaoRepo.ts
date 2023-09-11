import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import ICamiaoRepo from '../services/IRepos/ICamiaoRepo';
import { Camiao } from '../domain/camiao';
import { NomeCamiao } from '../domain/nomeCamiao';
import { CamiaoMap } from '../mappers/CamiaoMap';
import { ICamiaoPersistence } from '../dataschema/ICamiaoPersistence';
import { AtivoCamiao } from '../domain/ativoCamiao';

@Service()
export default class CamiaoRepo implements ICamiaoRepo{

    private models: any;

    constructor(
        @Inject('camiaoSchema') private camiaoSchema: Model<ICamiaoPersistence & Document>,
    ){}

    private createBaseQuery (): any {
        return {
            where: {},
        }
    }

    public async save(camiao: Camiao): Promise<Camiao> {
        const query = {nomeCamiao: camiao.nomeCamiao.props.nomeCamiao};

        const camiaoDocument = await this.camiaoSchema.findOne(query);

        try{
            if(camiaoDocument === null){
                const rawCamiao: any = CamiaoMap.toPersistence(camiao);
                
                const camiaoCreated = await this.camiaoSchema.create(rawCamiao);

                return CamiaoMap.toDomain(camiaoCreated);
            }else{
                camiaoDocument.id = camiao.id.toString();
                camiaoDocument.nomeCamiao = camiao.nomeCamiao.nomeCamiao;
                camiaoDocument.cargaTotalBaterias = camiao.cargaTotalBaterias.kWh;
                camiaoDocument.tara = camiao.tara.massaCamiao;
                camiaoDocument.maximoCarga = camiao.maximoCarga.massaCamiao;
                camiaoDocument.tempoCarregamento = camiao.tempoCarregamento.minutos;
                camiaoDocument.autonomia = camiao.autonomia.autonomia;
                camiaoDocument.matriculaCamiao = camiao.matriculaCamiao.matriculaCamiao;
                camiaoDocument.ativoCamiao = camiao.ativoCamiao.ativoCamiao;

                await camiaoDocument.save();

                return camiao;
            }
        }catch(e){
            throw e;
        }
    }

    public async findByDomainId(nomeCamiao: string | NomeCamiao): Promise<Camiao> {
        const query = {nomeCamiao: nomeCamiao};

        const camiaoRecord = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

        if(camiaoRecord != null){
            return CamiaoMap.toDomain(camiaoRecord);
        }else{
            return null;
        }
    }

    public async findAll(): Promise<Camiao[]> {
        const camiaoRecord = await this.camiaoSchema.find();

        let listaCamioes: Camiao[] = [];

        if(camiaoRecord != null){
            camiaoRecord.forEach(async camiao => {
                listaCamioes.push(await CamiaoMap.toDomain(camiao));
            });

            return listaCamioes;
        }else{
            return null;
        }
    }

    public async exists(camiao: Camiao): Promise<boolean> {
        const idX = camiao.nomeCamiao instanceof NomeCamiao ? (<NomeCamiao>camiao.nomeCamiao).nomeCamiao : camiao.nomeCamiao;

        const query = {nomeCamiao: idX};

        const camiaoDocument = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

        return !!camiaoDocument === true;
    }

    public async findByMatricula(matriculaCamiao: string): Promise<Camiao>{
        const query = {matriculaCamiao: matriculaCamiao};

        const camiaoRecord = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

        if(camiaoRecord !== null){
            return CamiaoMap.toDomain(camiaoRecord);
        }else{
            return null;
        }
    }

    public async findByAllActiveStatus(ativoCamiao: Boolean | AtivoCamiao): Promise<Camiao[]> {
        const query = {ativoCamiao: ativoCamiao};

        const camiaoRecord = await this.camiaoSchema.find(query as FilterQuery<ICamiaoPersistence & Document>);

        let listaCamioesAtivos: Camiao[] = [];

        if(camiaoRecord != null){
            camiaoRecord.forEach(async camiao => {
                listaCamioesAtivos.push(await CamiaoMap.toDomain(camiao));
            });

            return listaCamioesAtivos;
        }else{
            return null;
        }
    }
} 