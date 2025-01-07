import QuestionSetListing from '@/components/QuestionSet/QustionSetListing/QuestionSetListing';
import React from 'react';

const QuestionSetsPage: React.FC = () => (
  <div className='p-4 h-full flex flex-col bg-white shadow rounded-md'>
    <QuestionSetListing />
  </div>
);

export default QuestionSetsPage;
