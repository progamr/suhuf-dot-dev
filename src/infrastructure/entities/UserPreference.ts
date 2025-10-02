import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  ManyToMany,
  Collection,
  Enum,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

@Entity()
export class UserPreference {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @OneToOne('User', 'preference', { unique: true, owner: true })
  user!: any;

  @Enum(() => Theme)
  theme: Theme = Theme.SYSTEM;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Preferred sources
  @ManyToMany('Source', undefined, { owner: true })
  preferredSources = new Collection<any>(this);

  // Preferred categories
  @ManyToMany('Category', undefined, { owner: true })
  preferredCategories = new Collection<any>(this);

  // Preferred authors
  @ManyToMany('Author', undefined, { owner: true })
  preferredAuthors = new Collection<any>(this);
}
