import {
  BeforeInsert,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from "typeorm";

@Entity()
export class Geometry {
  constructor() {
    this.type = "Point";
  }

  @ObjectIdColumn()
  id!: string;

  @Column({
    type: "string",
    default: true,
  })
  type?: string;

  @Column({
    type: "array",
  })
  coordinates!: number[];

  @BeforeInsert()
  beforeInsertActions() {
    this.type = "point";
  }
}
