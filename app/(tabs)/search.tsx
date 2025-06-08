import React from 'react';
import ArticleList from '../../components/ArticleList';

export default function SearchArticlesScreen() {
  return <ArticleList enableSearch={true} enableCategory={true} initialCategory={7} />;
}
