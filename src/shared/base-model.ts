import { Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseModel<T>  {
  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  
}


