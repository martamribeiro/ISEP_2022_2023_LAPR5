import { Service } from "typedi";
import IArmazemRepo from "../services/IRepos/IArmazemRepo";
import fetch from 'node-fetch';
import https = require('https');

@Service()
export default class ArmazemRepo implements IArmazemRepo {
    httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

    public async findAll(): Promise<any[]> {
        const response = await fetch('https://localhost:5001/api/Armazem/', {
        method: 'GET',
        agent: this.httpsAgent,
        });

        return response.json();
    }
}