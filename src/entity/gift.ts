import {
  BeforeInsert,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from "typeorm";
import { Geometry } from "./geometry";

@Entity()
export class Gift {
  @ObjectIdColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  price!: number;

  @Column((type) => Geometry)
  geometry!: Geometry;
}
