import mongoose from "mongoose";
import { IUtilizadorPersistence } from "../../dataschema/IUtilizadorPersistence";

const Utilizador = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true
        },

        email: {
            type: String,
            lowercase: true,
            unique: true
        },

        primeiroNome: {
            type: String,
            index: true
        },

        ultimoNome: {
            type: String,
            index: true
        },

        password: {
            type: String,
            index: true
        },

        numeroTelefone: {
            type: Number,
            index: true
        },

        funcaoUtilizador: {
            type: String,
            index: true
        },
    },
    { timestamps: true },
);

export default mongoose.model<IUtilizadorPersistence & mongoose.Document>('Utilizadore', Utilizador);