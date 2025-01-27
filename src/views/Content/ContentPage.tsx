import ContentListing from '@/components/Content/ContentListing';

import React from 'react';

const ContentPage: React.FC = () => (
  <div className='p-4 h-full w-full flex flex-col bg-white shadow rounded-md'>
    <ContentListing />
  </div>
);

export default ContentPage;
