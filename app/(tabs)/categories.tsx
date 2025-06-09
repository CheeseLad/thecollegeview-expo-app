import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import { decodeHTMLEntities } from '../../utils/decodeHTMLEntities'; // Adjust path if needed

type Category = {
  id: number;
  name: string;
  parent?: number;
  hasChildren?: boolean;
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
        const response = await fetch(
          'https://thecollegeview.ie/wp-json/wp/v2/categories?include=4,7,5,687,6,220,68,9890,90,6880'
        );
        const data: Category[] = await response.json();

        // Check for children
        const checkChildren = await Promise.all(
          data.map(async (cat) => {
            const childRes = await fetch(`https://thecollegeview.ie/wp-json/wp/v2/categories?parent=${cat.id}&_fields=id`);
            const children = await childRes.json();
            return { ...cat, hasChildren: children.length > 0 };
          })
        );

        setCategories(checkChildren);
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
              label={decodeHTMLEntities(cat.name)}
              onPress={() => {
                if (cat.hasChildren) {
                  navigator.navigate('subcategories', { parentId: cat.id });
                } else {
                  navigator.navigate('category/[id]', { id: cat.id.toString() });
                }
              }}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
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
