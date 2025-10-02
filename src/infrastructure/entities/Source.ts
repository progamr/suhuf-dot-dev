import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Source {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  name!: string;

  @Property({ unique: true, index: true })
  slug!: string;

  @Property()
  apiIdentifier!: string; // guardian, newsapi, nytimes, bbc

  @Property({ nullable: true })
  logoUrl?: string;

  @Property({ default: true, index: true })
  isActive: boolean = true;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relations
  @OneToMany('Article', 'source')
  articles = new Collection<any>(this);

  @OneToMany('Author', 'source')
  authors = new Collection<any>(this);
}
