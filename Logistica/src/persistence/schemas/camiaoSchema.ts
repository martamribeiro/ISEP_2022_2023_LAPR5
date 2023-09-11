import { ICamiaoPersistence } from "../../dataschema/ICamiaoPersistence";
import mongoose from "mongoose";

const Camiao = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },
        
        nomeCamiao: {
            type: String,
            unique: true,
        },

        cargaTotalBaterias: {
            type: Number,
            index: true
        },

        tara: {
            type: Number,
            index: true
        },

        maximoCarga: {
            type: Number,
            index: true
        },

        autonomia: {
            type: Number,
            index: true
        },

        tempoCarregamento: {
            type: Number,
            index: true
        },

        matriculaCamiao: {
            type: String,
            index: true
        },

        ativoCamiao: {
            type: Boolean,
            index: true
        },
    },
    { timestamps: true },
);

export default mongoose.model<ICamiaoPersistence & mongoose.Document>('Camioe', Camiao);