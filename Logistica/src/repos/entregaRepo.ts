import { Service } from "typedi";
import IEntregasRepo from "../services/IRepos/IEntregasRepo";
import fetch from 'node-fetch';
import https = require('https');

@Service()
export default class EntregaRepo implements IEntregasRepo {
    httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    public async findAll(): Promise<any[]> {
        const response = await fetch('https://localhost:5001/api/Entrega/', {
        method: 'GET',
        agent: this.httpsAgent,
        });

        return response.json();
    }
}