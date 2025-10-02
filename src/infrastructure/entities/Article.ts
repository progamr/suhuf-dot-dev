import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ManyToMany,
  Collection,
  OneToMany,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
@Unique({ properties: ['source', 'externalId'] })
export class Article {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  title!: string;

  @Property({ type: 'text' })
  description!: string; // Snippet/summary

  @Property({ type: 'text', unique: true, index: true })
  url!: string; // Original article URL

  @Property({ type: 'text', nullable: true })
  imageUrl?: string;

  @Property({ index: true })
  publishedAt!: Date;

  @ManyToOne('Source', { index: true })
  source!: any;

  @ManyToOne('Author', { nullable: true })
  author?: any;

  @Property()
  externalId!: string; // ID from source API

  @Property({ default: 0, index: true })
  viewCount: number = 0;

  @Property()
  lastSyncedAt!: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relations
  @ManyToMany('Category', 'articles', { owner: true })
  categories = new Collection<any>(this);

  @OneToMany('Favorite', 'article')
  favorites = new Collection<any>(this);

  @OneToMany('ArticleView', 'article')
  views = new Collection<any>(this);
}
