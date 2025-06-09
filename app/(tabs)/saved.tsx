import { FontAwesome } from '@expo/vector-icons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSavedArticles } from '../../context/SavedArticlesContext';

export default function SavedScreen() {
  const { saved, remove } = useSavedArticles();

  if (saved.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No saved articles yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={saved}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ margin: 10, backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.id} - {item.title.rendered}</Text>
          <Text numberOfLines={2}>
            {item.content.rendered.replace(/<[^>]+>/g, '')}
          </Text>

          <TouchableOpacity
            onPress={() => remove(item.id)}
            style={{ marginTop: 10, alignSelf: 'flex-start' }}
          >
            <FontAwesome name="trash" size={18} color="darkred" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}
