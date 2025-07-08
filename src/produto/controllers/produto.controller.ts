import { ProdutoService } from '../services/produto.service';
import { Produto } from '../entities/produto.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/validade-no-mes')
  async getProdutosValidadeNoMes() {
    return this.produtoService.buscarProdutosValidadeNoMes();
  }

  @Get('/ordem-de-vencimento')
  async getProdutosOrdenadosPorVencimento() {
    return this.produtoService.buscarProdutosOrdenadosPorVencimento();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findAllByName(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findAllByName(nome);
  }

  @Get('/codigo/:codigo')
  async getProdutoPorCodigo(@Param('codigo', ParseIntPipe) codigo: number) {
    return this.produtoService.buscarProdutoPorCodigo(codigo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Patch('/:id/desconto/:percentual')
  @HttpCode(HttpStatus.OK)
  aplicarDescontoPorId(
    @Param('id', ParseIntPipe) id: number,
    @Param('percentual', ParseIntPipe) percentual: number,
  ): Promise<Produto> {
    return this.produtoService.aplicarDescontoPorId(id, percentual);
  }

  @Patch('/desconto/categoria/:categoriaId')
  @HttpCode(HttpStatus.OK)
  aplicarDescontoPorCategoria(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
    @Query('percentual', ParseIntPipe) percentual: number,
  ) {
    return this.produtoService.aplicarDescontoPorCategoria(
      categoriaId,
      percentual,
    );
  }

  @Patch('/desconto')
  @HttpCode(HttpStatus.OK)
  aplicarDescontoPorNomeOuFabricante(
    @Query('percentual', ParseIntPipe) percentual: number,
    @Query('nome') nome?: string,
    @Query('fabricante') fabricante?: string,
  ) {
    return this.produtoService.aplicarDescontoPorNomeOuFabricante(
      nome,
      fabricante,
      percentual,
    );
  }

  @Patch('/desconto-por-validade')
  async aplicarDescontoPorValidade(
    @Query('percentual', ParseIntPipe) percentual: number,
    @Query('diasMin') diasMin?: number,
    @Query('diasMax') diasMax?: number,
  ) {
    return this.produtoService.aplicarDescontoPorValidadeEntreDias(
      percentual,
      diasMin,
      diasMax,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.delete(id);
  }
}
