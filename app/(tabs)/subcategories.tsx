import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/Button';
import { decodeHTMLEntities } from '../../utils/decodeHTMLEntities'; // Adjust path if needed

type Category = {
  id: number;
  name: string;
};

export default function SubcategoriesScreen() {
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigation();
  const route = useRoute<any>(); // useRoute<{ params: { parentId: number } }> if you're using TypeScript strictly
  const { parentId } = route.params;

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const response = await fetch(
          `https://thecollegeview.ie/wp-json/wp/v2/categories?parent=${parentId}&_fields=id,name`
        );
        const data: Category[] = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error('Failed to fetch subcategories', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubcategories();
  }, [parentId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : subcategories.length === 0 ? (
        <Text style={styles.message}>No subcategories found.</Text>
      ) : (
        <View style={styles.footerContainer}>
          {subcategories.map((subcat) => (
            <Button
              key={subcat.id}
              label={decodeHTMLEntities(subcat.name)}
              onPress={() =>
                navigator.navigate('category/[id]', { id: subcat.id.toString() })
              }
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
    justifyContent: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
});
