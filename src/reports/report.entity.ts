import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  price: number;
}
