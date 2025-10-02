import { Article } from './Article';
import { Category } from './Category';

export interface FeedData {
  carousel: Article[];
  topCategories: Category[];
  latestArticles: Article[];
}
