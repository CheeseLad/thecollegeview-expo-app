import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';



export default function CombinedScreen() {
  const [aboutHtml, setAboutHtml] = useState(null);
  const [contactHtml, setContactHtml] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const [aboutRes, contactRes] = await Promise.all([
          fetch('https://thecollegeview.ie/wp-json/wp/v2/pages/?slug=about'),
          fetch('https://thecollegeview.ie/wp-json/wp/v2/pages/?slug=contact'),
        ]);

        const [aboutData, contactData] = await Promise.all([
          aboutRes.json(),
          contactRes.json(),
        ]);

        setAboutHtml(aboutData[0]?.content?.rendered || '');
        setContactHtml(contactData[0]?.content?.rendered || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchPages();
  }, []);

  if (!aboutHtml || !contactHtml) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      
    <Image
      source={{ uri: 'https://thecollegeview.ie/wp-content/uploads/2025/02/cropped-12.png' }}
      style={{
        width: screenWidth,
        aspectRatio: 3, // Adjust based on your image's actual width/height ratio
        alignSelf: 'center',
      }}
      resizeMode="contain"
    />

      <RenderHTML contentWidth={width} source={{ html: aboutHtml }} baseStyle={styles.htmlText} />

      <View style={styles.separator} />

      <RenderHTML contentWidth={width} source={{ html: contactHtml }} baseStyle={styles.htmlText} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 12,
  },
  htmlText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 24,
  },
  loader: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
