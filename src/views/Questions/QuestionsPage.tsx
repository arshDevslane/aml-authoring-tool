import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import QuestionFilters from '@/components/Questions/QuestionFilters';
import QuestionsListing from '@/components/Questions/QuestionsListing';
import { Button } from '@/components/ui/button';
import AmlListingFilterPopup from '@/shared-resources/AmlListingFilterPopup/AmlListingFilterPopup';
import {
  getListQuestionsAction,
  QuestionsActionPayloadType,
} from '@/store/actions/question.action';
import { filtersQuestionsSelector } from '@/store/selectors/questions.selector';

const transformFilterValue = (key: string, value: string): any => {
  switch (key) {
    case 'question_type':
      return value?.split(',');
    case 'page_no':
      return +value;
    default:
      return value;
  }
};

const serializeFilters = (
  filters: Record<string, any>
): Record<string, string> =>
  Object.entries(filters)?.reduce((acc, [key, value]) => {
    acc[key] = Array.isArray(value) ? value.join(',') : value?.toString();
    return acc;
  }, {} as Record<string, string>);

const QuestionsPage: React.FC = () => {
  const navigateTo = useNavigate();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const filters = useSelector(filtersQuestionsSelector);

  const [searchFilters, setSearchFilters] = useState(() => {
    const initialFilters: Record<string, any> = { ...filters };
    params.forEach((value, key) => {
      initialFilters[key] = transformFilterValue(key, value);
    });
    return initialFilters;
  });

  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const updateURL = (updatedFilters: Record<string, any>) => {
    const serializedFilters = serializeFilters(updatedFilters);
    navigateTo({
      pathname,
      search: `?${createSearchParams(serializedFilters)}`,
    });
  };

  useEffect(() => {
    if (!isInitialized) {
      const urlFilters: Record<string, any> = {};
      params.forEach((value, key) => {
        urlFilters[key] = transformFilterValue(key, value);
      });

      setSearchFilters((prevFilters) => ({
        ...prevFilters,
        ...urlFilters,
      }));

      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (isInitialized) {
      dispatch(
        getListQuestionsAction({
          filters: searchFilters as QuestionsActionPayloadType['filters'],
        })
      );
      updateURL(searchFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters, isInitialized]);

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
