import { Schema } from 'mongoose';


export const TransacaoSchema = new Schema({
  descricao: { type: String, required: true },
  valor: { type: Number, required: true, min: [0.01, 'valor deve ser maior que zero'] },
  tipo: { type: String, required: true, enum: ['receita', 'despesa'] },
  categoria: { type: String, required: true },
  consumoConsciente: { type: Boolean, default: true },
});


export interface Transacao {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  consumoConsciente: boolean;
}