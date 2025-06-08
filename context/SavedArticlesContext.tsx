// context/SavedArticlesContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Article {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  author: number;
  featured_media: number;
}

interface SavedArticlesContextType {
  saved: Article[];
  toggleSave: (article: Article) => void;
  isSaved: (id: number) => boolean;
  remove: (id: number) => void;
}

const SavedArticlesContext = createContext<SavedArticlesContextType | undefined>(undefined);

export const SavedArticlesProvider = ({ children }: { children: React.ReactNode }) => {
  const [saved, setSaved] = useState<Article[]>([]);

  useEffect(() => {
    const loadSaved = async () => {
      const json = await AsyncStorage.getItem('@saved_articles');
      if (json) setSaved(JSON.parse(json));
    };
    loadSaved();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@saved_articles', JSON.stringify(saved));
  }, [saved]);

  const toggleSave = (article: Article) => {
    setSaved((prev) =>
      prev.find((a) => a.id === article.id)
        ? prev.filter((a) => a.id !== article.id)
        : [...prev, article]
    );
  };

  const isSaved = (id: number) => saved.some((a) => a.id === id);

  const remove = (id: number) => {
    setSaved((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <SavedArticlesContext.Provider value={{ saved, toggleSave, isSaved, remove }}>
      {children}
    </SavedArticlesContext.Provider>
  );
};

export const useSavedArticles = () => {
  const context = useContext(SavedArticlesContext);
  if (!context) throw new Error('Must use within SavedArticlesProvider');
  return context;
};
