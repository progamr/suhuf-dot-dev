import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
@Index({ properties: ['article', 'user'], options: { unique: true, nullsNotDistinct: false } })
@Index({ properties: ['article', 'ipHash'], options: { unique: true, nullsNotDistinct: false } })
export class ArticleView {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne('Article', { index: true })
  article!: any;

  @ManyToOne('User', { nullable: true })
  user?: any;

  @Property({ nullable: true })
  ipHash?: string; // SHA-256 hash of IP for anonymous users

  @Property()
  createdAt: Date = new Date();
}
