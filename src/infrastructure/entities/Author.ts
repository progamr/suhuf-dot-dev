import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
@Unique({ properties: ['source', 'externalId'] })
export class Author {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name!: string;

  @ManyToOne('Source', { index: true })
  source!: any;

  @Property({ nullable: true })
  externalId?: string; // ID from source API

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relations
  @OneToMany('Article', 'author')
  articles = new Collection<any>(this);
}
