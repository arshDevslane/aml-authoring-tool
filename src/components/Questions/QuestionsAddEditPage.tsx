import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { allQuestionsSelector } from '@/store/selectors/questions.selector';
import { Question } from '@/models/entities/Question';
import { getQuestionAction } from '@/store/actions/question.action';
import cx from 'classnames';
import { ArrowLeft } from 'lucide-react';
import { navigateTo } from '@/store/actions/navigation.action';
import QuestionAddEditForm from './QuestionAddEditForm';
import Loader from '../Loader/Loader';
import QuestionViewPage from './QuestionView/QuestionViewPage';
import { transformQuestion } from './QuestionView/QuestionViewUtils';

interface QuestionsAddEditPageProps {
  questionId?: string;
  onClose?: () => void;
  viewMode?: boolean;
}

const QuestionsAddEditPage: React.FC<QuestionsAddEditPageProps> = ({
  questionId,
  onClose,
  viewMode = false,
}) => {
  const { id: urlId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const questions = useSelector(allQuestionsSelector);
  const [questionData, setQuestionData] = useState<Question | null>(null);

  // Lock mode (popup or page) on initial render
  const isPopupMode = useMemo(() => !!questionId, []);
  const effectiveId = isPopupMode ? questionId : urlId;

  const question = effectiveId ? questions[effectiveId] : null;

  useEffect(() => {
    if (effectiveId) {
      dispatch(getQuestionAction({ id: effectiveId }));
    }
  }, [effectiveId]);

  useEffect(() => {
    if (effectiveId && question) {
      setQuestionData(question);
    }
  }, [effectiveId, question]);

  const label = useMemo(() => {
    if (viewMode) return 'View Question';
    if (effectiveId) return 'Edit Question';
    return 'Add Question';
  }, [viewMode, effectiveId]);

  return (
    <div
      className={cx(
        'flex-1 overflow-x-hidden p-4 h-full flex flex-col ',
        questionId ? '' : 'bg-white shadow rounded-md'
      )}
    >
      <div className='flex gap-6 items-center mb-4'>
        {!questionId && (
          <ArrowLeft
            className='h-8 w-8 cursor-pointer'
            onClick={() => dispatch(navigateTo('/app/questions'))}
          />
        )}
        <h1 className='text-2xl font-bold'>{label}</h1>
      </div>
      {effectiveId && !questionData ? (
        <p>
          <Loader />
        </p>
      ) : (
        <div className='flex flex-1'>
          {viewMode ? (
            <QuestionViewPage question={transformQuestion(questionData)} />
          ) : (
            <QuestionAddEditForm
              id={effectiveId}
              question={questionData}
              onClose={onClose}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionsAddEditPage;
