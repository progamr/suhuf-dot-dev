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
import '../db/reflect-metadata';

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

  @ManyToOne({ entity: 'Source', type: 'Source', index: true })
  source!: any;

  @ManyToOne({ entity: 'Author', type: 'Author', nullable: true })
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
  @ManyToMany({ entity: 'Category', type: 'Category', owner: true, pivotTable: 'article_categories' })
  categories = new Collection<any>(this);

  @OneToMany({ entity: 'Favorite', type: 'Favorite', mappedBy: 'article' })
  favorites = new Collection<any>(this);

  @OneToMany({ entity: 'ArticleView', type: 'ArticleView', mappedBy: 'article' })
  views = new Collection<any>(this);
}
