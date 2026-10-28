import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao } from './transacao.schema.js';
import { CriarTransacaoDto } from './dto/criar-transacao.dto.js';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel('Transacao') private readonly transacaoModel: Model<Transacao>,
  ) {}

  async criar(dados: CriarTransacaoDto) {
    try {
      const nova = new this.transacaoModel({
        descricao: dados.descricao,
        valor: dados.valor,
        tipo: dados.tipo,
        categoria: dados.categoria,
        consumoConsciente: dados.consumoConsciente,
      });
      const salva = await nova.save();
      return this.formatar(salva);
    } catch (erro: any) {
    
      if (erro?.name === 'ValidationError') {
        throw new BadRequestException(erro.message);
      }
      throw erro;
    }
  }

  
  async listar() {
    const transacoes = await this.transacaoModel.find().exec();
    const historico = transacoes.map((t) => this.formatar(t));

    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const t of historico) {
      if (t.tipo === 'receita') {
        totalReceitas += t.valor;
      } else {
        totalDespesas += t.valor;
        if (!t.consumoConsciente) {
          totalGastoImpulso += t.valor; 
        }
      }
    }

    return {
      historico,
      metricas: {
        saldoTotal: this.arredondar(totalReceitas - totalDespesas),
        totalDespesas: this.arredondar(totalDespesas),
        totalGastoImpulso: this.arredondar(totalGastoImpulso),
      },
    };
  }

 
  private formatar(t: Transacao & { id?: any }) {
    return {
      id: t.id as string,
      descricao: t.descricao,
      valor: t.valor,
      tipo: t.tipo,
      categoria: t.categoria,
      consumoConsciente: t.consumoConsciente,
    };
  }

  private arredondar(valor: number): number {
    return Math.round(valor * 100) / 100;
  }
}