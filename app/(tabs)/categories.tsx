import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Button from '@/components/Button';

type Category = {
  id: number;
  name: string;
};

export default function Index() {

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigator = useNavigation();

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('https://thecollegeview.ie/wp-json/wp/v2/categories?include=4,7,5,687,6,220,68,9890,90,6880');
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>

      {loadingCategories ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.footerContainer}>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              label={cat.name}
              onPress={() => navigator.navigate('category/[id]', { id: cat.id.toString() })}
              theme="primary"
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  categoriesScroll: {
    maxHeight: 50,
    marginVertical: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  categoryButton: {
    marginHorizontal: 5,
    minWidth: 100,
  },
});
