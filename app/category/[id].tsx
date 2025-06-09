import ArticleList from '@/components/ArticleList';
import { useLocalSearchParams } from 'expo-router';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = id ? parseInt(id, 10) : undefined;

  return <ArticleList enableSearch={true} enableCategory={false} initialCategory={categoryId} />;
}
