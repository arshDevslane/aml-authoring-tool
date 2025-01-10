import Loader from '@/components/Loader/Loader';
import QuestionSetDetailPublish from '@/components/QuestionSet/QuestionSetListing/QuestionSetDetails/QuestionSetDetailPublish/QuestionSetDetailPublish';
import { navigateTo } from '@/store/actions/navigation.action';
import { getQuestionSetAction } from '@/store/actions/questionSet.actions';
import {
  allQuestionSetsSelector,
  isLoadingQuestionSetsSelector,
} from '@/store/selectors/questionSet.selector';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const QuestionSetDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const allQuestionSets = useSelector(allQuestionSetsSelector);
  const isLoadingQuestionSet = useSelector(isLoadingQuestionSetsSelector);

  const questionSet = allQuestionSets?.[id!] ?? {};

  React.useEffect(() => {
    if (!id) {
      dispatch(navigateTo(`/`));
    } else if (id) {
      dispatch(
        getQuestionSetAction({
          id,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoadingQuestionSet) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return <QuestionSetDetailPublish questionSet={questionSet} />;
};
export default QuestionSetDetailPage;
