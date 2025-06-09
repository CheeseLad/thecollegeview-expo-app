import React from 'react';
import ArticleList from '../../components/ArticleList';

export default function Index() {
  // Assume category 3 is passed or hardcoded for demo
  return <ArticleList enableSearch={false} enableCategory={false} />;
}
