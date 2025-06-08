import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://thecollegeview.ie/wp-json/wp/v2/posts/${id}`);
        const data = await res.json();
        setArticle(data);

        // Set the screen title
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (!article) return <Text>Article not found.</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        {article.title.rendered}
      </Text>
      <Text>{article.content.rendered.replace(/<[^>]+>/g, '')}</Text>
    </ScrollView>
  );
}
