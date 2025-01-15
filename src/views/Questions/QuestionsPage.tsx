import QuestionFilters from '@/components/Questions/QuestionFilters';
import QuestionsListing from '@/components/Questions/QuestionsListing';
import { Button } from '@/components/ui/button';
import AmlListingFilterPopup from '@/shared-resources/AmlListingFilterPopup/AmlListingFilterPopup';
import { getListQuestionsAction } from '@/store/actions/question.action';
import { filtersQuestionsSelector } from '@/store/selectors/questions.selector';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const QuestionsPage: React.FC = () => {
  const navigateTo = useNavigate();
  const filters = useSelector(filtersQuestionsSelector);
  const [searchFilters, setSearchFilters] = useState(filters);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListQuestionsAction({
        filters: searchFilters,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters]);

  const createQuestion = () => {
    navigateTo(`add`);
  };
  return (
    <div className='p-4 h-full w-full flex flex-col bg-white shadow rounded-md'>
      <div className='flex justify-between mb-4 items-center'>
        <h1 className='text-2xl font-bold'>Questions</h1>
        <div className='flex items-center space-x-4'>
          <AmlListingFilterPopup
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            Component={QuestionFilters}
          />
          <Button onClick={createQuestion}>+ Create</Button>
        </div>
      </div>
      <QuestionsListing
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
      />
    </div>
  );
};

export default QuestionsPage;
