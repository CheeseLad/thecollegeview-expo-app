import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSavedArticles } from '../../context/SavedArticlesContext';

interface Article {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  author: number;
  featured_media: number;
}
export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedArticles();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://thecollegeview.ie/wp-json/wp/v2/posts');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const fetchFeaturedMedia = async (mediaId: number) => {
    try {
      const response = await fetch(`https://thecollegeview.ie/wp-json/wp/v2/media/${mediaId}`);
      const data = await response.json();
      return data.source_url;
    } catch {
      return '';
    }
  };

  const fetchAuthorName = async (authorId: number) => {
    try {
      const response = await fetch(`https://thecollegeview.ie/wp-json/wp/v2/users/${authorId}`);
      const data = await response.json();
      return data.name;
    } catch {
      return 'Unknown';
    }
  };

  const extractTextFromHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const renderItem = ({ item }: { item: Article }) => {
    const previewText =
      extractTextFromHtml(item.content.rendered).split(' ').slice(0, 35).join(' ') + '...';
    //const formattedDate = `⏰ ${format(new Date(item.date), 'MMMM d, yyyy')}`;
    const formattedDate = `⏰ ${new Date(item.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/article/${item.id}`)}
      >
        <View style={styles.row}>
          <FeaturedImage mediaId={item.featured_media} />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.title.rendered}
            </Text>
            <Text style={styles.meta}>{formattedDate}</Text>
            <AuthorName authorId={item.author} />
          
          </View>

        </View>
                  <Text numberOfLines={3} ellipsizeMode="tail">
              {previewText}
            </Text>
                    <TouchableOpacity onPress={() => toggleSave(item)} style={{ marginTop: 6 }}>
          <FontAwesome
            name={isSaved(item.id) ? 'heart' : 'heart-o'}
            size={18}
            color={isSaved(item.id) ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );

  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

const FeaturedImage: React.FC<{ mediaId: number }> = ({ mediaId }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://thecollegeview.ie/wp-json/wp/v2/media/${mediaId}`)
      .then((res) => res.json())
      .then((data) => setUrl(data.source_url))
      .catch(() => setUrl(null));
  }, [mediaId]);

  if (!url) return <ActivityIndicator />;

  return (
    <Image
      source={{ uri: url }}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

const AuthorName: React.FC<{ authorId: number }> = ({ authorId }) => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://thecollegeview.ie/wp-json/wp/v2/users/${authorId}`)
      .then((res) => res.json())
      .then((data) => setName(data.name))
      .catch(() => setName(null));
  }, [authorId]);

  if (!name) return <ActivityIndicator />;
  return <Text>👤 {name}</Text>;
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    flexShrink: 1,
  },
  meta: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
});
