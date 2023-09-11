import mongoose from "mongoose";
import { IViagemPersistence } from "../../dataschema/IViagemPersistence";

const Viagem = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
    },

    camiao: {
      type: String,
      index: true,
    },

    data: {
      type: String,
      index: true,
    },

    armazens: {
      type: Array,
      index: true,
    },

    tempoViagem: {
      type: Number,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IViagemPersistence & mongoose.Document>(
  "Viagem",
  Viagem
);
