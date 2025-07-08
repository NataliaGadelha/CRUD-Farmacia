import { CategoriaService } from './../../categoria/services/categoria.service';
import { Produto } from '../entities/produto.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: {
        id,
      },
      relations: {
        categoria: true,
      },
    });

    if (!produto)
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

    return produto;
  }

  async findAllByName(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true,
      },
    });
  }

  async buscarProdutosValidadeNoMes(): Promise<Produto[]> {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    return this.produtoRepository.find({
      where: {
        data_validade: Between(primeiroDia, ultimoDia),
      },
    });
  }

  async buscarProdutosOrdenadosPorVencimento(): Promise<Produto[]> {
    return this.produtoRepository.find({
      order: {
        data_validade: 'ASC',
      },
    });
  }

  async buscarProdutoPorCodigo(codigo: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOneBy({ codigo });
    if (!produto) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return produto;
  }

  async aplicarDescontoPorValidadeEntreDias(
    percentual: number,
    diasMin = 30,
    diasMax = 60,
  ): Promise<Produto[]> {
    if (percentual < 0 || percentual > 100) {
      throw new HttpException(
        'Percentual de desconto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hoje = new Date();

    const dataMin = new Date(hoje);
    dataMin.setDate(dataMin.getDate() + diasMin);
    dataMin.setHours(0, 0, 0, 0);

    const dataMax = new Date(hoje);
    dataMax.setDate(dataMax.getDate() + diasMax);
    dataMax.setHours(23, 59, 59, 999);

    const produtos = await this.produtoRepository.find({
      where: {
        data_validade: Between(dataMin, dataMax),
      },
    });

    if (!produtos.length) {
      throw new HttpException(
        'Nenhum produto encontrado no intervalo de validade informado',
        HttpStatus.NOT_FOUND,
      );
    }

    const produtosComDesconto = produtos.map((produto) => {
      produto.preco = parseFloat(
        (produto.preco * (1 - percentual / 100)).toFixed(2),
      );
      return produto;
    });

    return this.produtoRepository.save(produtosComDesconto);
  }

  async aplicarDescontoPorId(id: number, percentual: number): Promise<Produto> {
    const produto = await this.findById(id);

    if (percentual < 0 || percentual > 100) {
      throw new HttpException(
        'Percentual de desconto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    produto.preco = parseFloat(
      (produto.preco * (1 - percentual / 100)).toFixed(2),
    );
    return await this.produtoRepository.save(produto);
  }

  async aplicarDescontoPorCategoria(
    categoriaId: number,
    percentual: number,
  ): Promise<Produto[]> {
    if (percentual < 0 || percentual > 100) {
      throw new HttpException(
        'Percentual de desconto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const produtos = await this.produtoRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria'],
    });

    if (!produtos.length) {
      throw new HttpException(
        'Nenhum produto encontrado para essa categoria',
        HttpStatus.NOT_FOUND,
      );
    }

    const produtosComDesconto = produtos.map((produto) => {
      produto.preco = parseFloat(
        (produto.preco * (1 - percentual / 100)).toFixed(2),
      );
      return produto;
    });

    return await this.produtoRepository.save(produtosComDesconto);
  }

  async aplicarDescontoPorNomeOuFabricante(
    nome?: string,
    fabricante?: string,
    percentual = 0,
  ): Promise<Produto[]> {
    if (percentual < 0 || percentual > 100) {
      throw new HttpException(
        'Percentual de desconto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!nome && !fabricante) {
      throw new HttpException(
        'Informe pelo menos o nome ou o fabricante',
        HttpStatus.BAD_REQUEST,
      );
    }

    const query = this.produtoRepository.createQueryBuilder('produto');

    if (nome) {
      query.andWhere('LOWER(produto.nome) LIKE LOWER(:nome)', {
        nome: `%${nome}%`,
      });
    }

    if (fabricante) {
      query.andWhere('LOWER(produto.fabricante) LIKE LOWER(:fabricante)', {
        fabricante: `%${fabricante}%`,
      });
    }

    const produtos = await query.getMany();

    if (!produtos.length) {
      throw new HttpException(
        'Nenhum produto encontrado com os critérios informados',
        HttpStatus.NOT_FOUND,
      );
    }

    const produtosComDesconto = produtos.map((produto) => {
      produto.preco = parseFloat(
        (produto.preco * (1 - percentual / 100)).toFixed(2),
      );
      return produto;
    });

    return await this.produtoRepository.save(produtosComDesconto);
  }

  async create(produto: Produto): Promise<Produto> {
    await this.categoriaService.findById(produto.categoria.id);

    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);

    await this.categoriaService.findById(produto.categoria.id);

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);

    return await this.produtoRepository.delete(id);
  }
}
