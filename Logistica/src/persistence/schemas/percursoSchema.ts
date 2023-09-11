import { IPercursoPersistence } from '../../dataschema/IPercursoPersistence';
import mongoose from 'mongoose';

const Percurso = new mongoose.Schema(
    {
      domainId: { 
        type: String,
        unique: true
      },

      armazemPartida: {
        type: String,
        index: true
      },
  
      armazemChegada: {
        type: String,
        index: true
      },
  
      distancia: {
        type: Number,
        index: true
      },
  
      duracao: {
        type: Number,
        index: true
      },

      energiaGasta: {
        type: Number,
        index: true
      },

      tempoExtra: {
        type: Number,
        index: true
      },
  
    },
    { timestamps: true },
  );

  export default mongoose.model<IPercursoPersistence & mongoose.Document>('Percurso', Percurso);