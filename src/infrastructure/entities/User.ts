import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import '../db/reflect-metadata';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true, index: true })
  email!: string;

  @Property({ nullable: true })
  emailVerified?: Date;

  @Property({ nullable: true })
  name?: string;

  @Property({ hidden: true })
  passwordHash!: string;

  @Property({ onCreate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  updatedAt: Date = new Date();

  // Relations
  @OneToOne({ entity: 'UserPreference', type: 'UserPreference', mappedBy: 'user', nullable: true })
  preference?: any;

  @OneToMany({ entity: 'Favorite', type: 'Favorite', mappedBy: 'user' })
  favorites = new Collection<any>(this);

  @OneToMany({ entity: 'ArticleView', type: 'ArticleView', mappedBy: 'user' })
  views = new Collection<any>(this);
}
