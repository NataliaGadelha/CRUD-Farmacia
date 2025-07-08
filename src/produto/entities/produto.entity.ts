/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsDateString, IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity('tb_produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  codigo: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column('decimal', { precision: 8, scale: 2, nullable: false })
  preco: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  quantidade: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  descricao: string;

  @IsNotEmpty()
  @IsDateString()
  @Column({ type: 'date', nullable: false })
  data_validade: Date;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  fabricante: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}
