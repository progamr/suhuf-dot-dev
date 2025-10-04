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
import '../db/reflect-metadata';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

@Entity()
export class UserPreference {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @OneToOne({ entity: 'User', type: 'User', mappedBy: 'preference', unique: true, owner: true })
  user!: any;

  @Enum(() => Theme)
  theme: Theme = Theme.SYSTEM;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Preferred sources
  @ManyToMany({ entity: 'Source', type: 'Source', owner: true })
  preferredSources = new Collection<any>(this);

  // Preferred categories
  @ManyToMany({ entity: 'Category', type: 'Category', owner: true })
  preferredCategories = new Collection<any>(this);

  // Preferred authors
  @ManyToMany({ entity: 'Author', type: 'Author', owner: true })
  preferredAuthors = new Collection<any>(this);
}
