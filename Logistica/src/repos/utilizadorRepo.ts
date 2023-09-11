import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import IUtilizadorRepo from '../services/IRepos/IUtilizadorRepo';
import { Username } from '../domain/username';
import { Email } from '../domain/email';
import { IUtilizadorPersistence } from '../dataschema/IUtilizadorPersistence';
import { UtilizadorMap } from '../mappers/UtilizadorMap';
import { Utilizador } from '../domain/utilizador';

@Service()
export default class UtilizadorRepo implements IUtilizadorRepo{
    private models: any;

    constructor(
        @Inject('utilizadorSchema') private utilizadorSchema: Model<IUtilizadorPersistence & Document>,
    ){}

    private createBaseQuery (): any {
        return {
            where: {},
        }
    }

    public async save(utilizador: Utilizador): Promise<Utilizador> {
        const query = {username: utilizador.username.props.username};

        const utilizadorDocument = await this.utilizadorSchema.findOne(query);

        try{
            if(utilizadorDocument === null){
                const rawUtilizador: any = UtilizadorMap.toPersistence(utilizador);

                const utilizadorCreated = await this.utilizadorSchema.create(rawUtilizador);

                return UtilizadorMap.toDomain(utilizadorCreated);
            }else{
                utilizadorDocument.username = utilizador.username.props.username,
                utilizadorDocument.email = utilizador.email.props.email,
                utilizadorDocument.primeiroNome = utilizador.primeiroNome.props.primeiroNome,
                utilizadorDocument.ultimoNome = utilizador.ultimoNome.props.ultimoNome,
                utilizadorDocument.password = utilizador.password.props.password,
                utilizadorDocument.numeroTelefone = utilizador.numeroTelefone.props.numeroTelefone,
                utilizadorDocument.funcaoUtilizador = utilizador.funcaoUtilizador.props.funcaoUtilizador

                await utilizadorDocument.save();

                return utilizador;
            }
        }catch(e){

        }
    }

    public async findAll(): Promise<Utilizador[]> {
        const utilizadorRecord = await this.utilizadorSchema.find();

        let listaUtilizadores: Utilizador[] = [];

        if(utilizadorRecord != null){
            utilizadorRecord.forEach(async utilizador => {
                listaUtilizadores.push(await UtilizadorMap.toDomain(utilizador));
            });

            return listaUtilizadores;
        }else{
            return null;
        }
    }

    public async findByUsername(username: string | Username): Promise<Utilizador> {
        const query = {username: username};

        const utilizadorRecord = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);
        
        if(utilizadorRecord != null){
            return UtilizadorMap.toDomain(utilizadorRecord);
        }else{
            return null;
        }
    }

    public async findByEmail(email: string | Email): Promise<Utilizador> {
        const query = {email: email};

        const utilizadorRecord = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);

        if(utilizadorRecord != null){
            return UtilizadorMap.toDomain(utilizadorRecord);
        }else{
            return null;
        }
    }

    public async exists(utilizador: Utilizador): Promise<boolean> {
        const idX = utilizador.username instanceof Username ? (<Username>utilizador.username).username : utilizador.username;

        const query = {username: idX};

        const utilizadorDocument = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);

        return !!utilizadorDocument === true;
    }

}