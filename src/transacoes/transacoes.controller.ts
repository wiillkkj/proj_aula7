import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransacoesService } from './transacoes.service.js';
import { CriarTransacaoDto } from './dto/criar-transacao.dto.js';
 
@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}
 
  @Post()
  criar(@Body() dados: CriarTransacaoDto) {
    return this.transacoesService.criar(dados);
  }
 
  @Get()
  listar() {
    return this.transacoesService.listar();
  }
}