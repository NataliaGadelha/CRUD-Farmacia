import { CategoriaService } from './../services/categoria.service';
import { Categoria } from './../entities/categoria.entity';
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
} from '@nestjs/common';

@Controller('/categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categoriaService.findById(id);
  }

  @Get('/descricao/:descricao')
  @HttpCode(HttpStatus.OK)
  findAllByDescricao(
    @Param('descricao') descricao: string,
  ): Promise<Categoria[]> {
    return this.categoriaService.findAllByDescricao(descricao);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findAllByNome(@Param('nome') nome: string): Promise<Categoria[]> {
    return this.categoriaService.findAllByNome(nome);
  }

  @Get('/:id/contar-produtos')
  @HttpCode(HttpStatus.OK)
  contarProdutos(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.categoriaService.contarProdutosPorCategoria(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.create(categoria);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.update(categoria);
  }

  @Patch('/:id/descricao')
  @HttpCode(HttpStatus.OK)
  updateDescricao(
    @Param('id', ParseIntPipe) id: number,
    @Body('descricao') novaDescricao: string,
  ): Promise<Categoria> {
    return this.categoriaService.updateDescricao(id, novaDescricao);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.delete(id);
  }
}
