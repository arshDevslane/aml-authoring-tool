import QuestionsListing from '@/components/Questions/QuestionsListing';
import React from 'react';

const QuestionsPage: React.FC = () => (
  <div className='p-4 h-full flex flex-col bg-white shadow rounded-md'>
    <h1 className='text-2xl font-bold mb-4'>Questions</h1>
    <QuestionsListing />
  </div>
);

export default QuestionsPage;
