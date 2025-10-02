import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
@Unique({ properties: ['user', 'article'] })
export class Favorite {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne('User', { index: true })
  user!: any;

  @ManyToOne('Article')
  article!: any;

  @Property({ index: true })
  createdAt: Date = new Date();
}
