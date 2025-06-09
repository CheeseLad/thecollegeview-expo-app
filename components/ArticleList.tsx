import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSavedArticles } from '../context/SavedArticlesContext';
import { decodeHTMLEntities } from '../utils/decodeHTMLEntities'; // Adjust path if needed
import CategoryFilter from './CategoryFilter';

interface Article {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  author: number;
  featured_media: number;
}

interface ArticleListProps {
  initialCategory?: number | null;
  enableSearch?: boolean;
  enableCategory?: boolean;
}

// Debounce helper
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};


export default function ArticleList({ initialCategory = null, enableSearch = false, enableCategory = false }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const categoryIds = [4, 7, 5, 687, 6, 220, 68, 9890, 90, 6880];

  const router = useRouter();
  const { toggleSave, isSaved } = useSavedArticles();

  const perPage = 10; // Number of articles per page

  const buildUrl = (query = '', category: number | null = null, pageNum = 1) => {
    const categoryFilter = category ? `&categories=${category}` : '';
    const searchFilter = query ? `&search=${encodeURIComponent(query)}` : '';
    return `https://thecollegeview.ie/wp-json/wp/v2/posts/?${categoryFilter}${searchFilter}&_fields=id,date,title,content,link,author,featured_media&page=${pageNum}&per_page=${perPage}`;
  };

  const fetchArticles = async (query = '', isSearch = false, category: number | null = null, pageNum = 1, append = false) => {
    if (pageNum === 1) {
      if (isSearch) setSearching(true);
      else setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const url = buildUrl(query, category, pageNum);
      const response = await fetch(url);

      if (!response.ok) {
        // If 400 or 404, probably no more pages
        if (response.status === 400 || response.status === 404) {
          setHasMore(false);
          return;
        }
        throw new Error('Network response was not ok');
      }

      const data: Article[] = await response.json();

      if (append) {
        setArticles(prev => [...prev, ...data]);
      } else {
        setArticles(data);
      }

      // If fewer articles than perPage, no more pages
      setHasMore(data.length === perPage);
    } catch (error) {
      console.error(error);
      setHasMore(false);
    } finally {
      if (pageNum === 1) {
        if (isSearch) setSearching(false);
        else setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  // Reset page and fetch when category or search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (!enableSearch || searchQuery.trim() === '') {
      fetchArticles('', false, selectedCategory, 1, false);
    } else {
      debouncedFetch(searchQuery, true, selectedCategory, 1, false);
    }
  }, [selectedCategory, searchQuery]);

  // Debounced fetch with pagination and append flag
  const debouncedFetch = useCallback(
    debounce(
      (query: string, isSearch: boolean, category: number | null, pageNum: number, append: boolean) =>
        fetchArticles(query, isSearch, category, pageNum, append),
      500
    ),
    []
  );


  // Load more when end reached
  const loadMore = () => {
    if (loadingMore || loading || searching || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    if (!enableSearch || searchQuery.trim() === '') {
      fetchArticles('', false, selectedCategory, nextPage, true);
    } else {
      debouncedFetch(searchQuery, true, selectedCategory, nextPage, true);
    }
  };

  const extractTextFromHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  const renderItem = ({ item }: { item: Article }) => {
    const previewText =
      extractTextFromHtml(item.content.rendered).split(' ').slice(0, 35).join(' ') + '...';
    const formattedDate = `⏰ ${new Date(item.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`;

    return (
      <TouchableOpacity style={styles.card} onPress={() => router.push(`/article/${item.id}`)}>
        <View style={styles.row}>
          <FeaturedImage mediaId={item.featured_media} />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {decodeHTMLEntities(item.title.rendered)}
            </Text>
            <Text style={styles.meta}>{formattedDate}</Text>
            <AuthorName authorId={item.author} />
          </View>
        </View>
        <Text numberOfLines={3} ellipsizeMode="tail">
          {decodeHTMLEntities(previewText)}
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
    <View style={{ flex: 1 }}>
      {enableSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      )}

      {enableCategory && (
            <View style={styles.categoryFilterContainer}>
      <CategoryFilter
        categoryIds={categoryIds}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </View>
      )}

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />

      {(loading || searching) && <ActivityIndicator style={{ marginTop: 20 }} />}
      {searching && (
        <View style={styles.searchingOverlay}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
    </View>
  );
}

const FeaturedImage: React.FC<{ mediaId: number }> = ({ mediaId }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://thecollegeview.ie/wp-json/wp/v2/media/${mediaId}`)
      .then((res) => res.json())
      .then((data) => setUrl(data.source_url))
      .catch(() => setUrl(null));
  }, [mediaId]);

  if (!url) return <ActivityIndicator />;

  return <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />;
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
  searchingOverlay: {
    position: 'absolute',
    right: 20,
    top: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    backgroundColor: '#fff',
  },
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
  categoryFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  categoryButton: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categorySelected: {
    fontWeight: 'bold',
    color: 'blue',
  },
});
