/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_categoria')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  descricao: string;
}
