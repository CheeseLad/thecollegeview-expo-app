import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { decodeHTMLEntities } from '../utils/decodeHTMLEntities'; // Adjust path if needed


interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categoryIds: number[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  endpoint?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryIds,
  selectedCategory,
  setSelectedCategory,
  endpoint = 'https://thecollegeview.ie/wp-json/wp/v2/categories',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${endpoint}?include=${categoryIds.join(',')}`);
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryIds.length > 0) {
      fetchCategories();
    }
  }, [categoryIds]);

  if (loading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <View style={styles.categoryFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={styles.categoryButton}
        >
          <Text style={[styles.categoryText, selectedCategory === null && styles.categorySelected]}>
            All Articles
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.categoryButton}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categorySelected,
              ]}
            >
              {decodeHTMLEntities(category.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryFilterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categorySelected: {
    fontWeight: 'bold',
    color: '#007aff',
  },
});

export default CategoryFilter;
