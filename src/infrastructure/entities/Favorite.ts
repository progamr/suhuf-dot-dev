import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import '../db/reflect-metadata';

@Entity()
@Unique({ properties: ['user', 'article'] })
export class Favorite {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne({ entity: 'User', type: 'User', index: true })
  user!: any;

  @ManyToOne({ entity: 'Article', type: 'Article' })
  article!: any;

  @Property({ index: true })
  createdAt: Date = new Date();
}
