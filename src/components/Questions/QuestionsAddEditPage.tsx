import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { allQuestionsSelector } from '@/store/selectors/questions.selector';
import { Question } from '@/models/entities/Question';
import { getQuestionAction } from '@/store/actions/question.action';
import QuestionAddEditForm from './QuestionAddEditForm';
import Loader from '../Loader/Loader';

const QuestionsAddEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [questionData, setQuestionData] = useState<Question | null>(null); // Replace `any` with the proper type
  const questions = useSelector(allQuestionsSelector);
  const dispatch = useDispatch();
  const question = questions[id!];

  useEffect(() => {
    if (id) {
      dispatch(getQuestionAction({ id }));
    }
  }, [id]);
  useEffect(() => {
    if (!!id && !!question) {
      setQuestionData(question);
    }
  }, [id, question]);

  return (
    <div className='flex-1 overflow-x-hidden p-4 h-full flex flex-col bg-white shadow rounded-md'>
      <h1 className='text-2xl font-bold mb-4'>
        {id ? 'Edit Question' : 'Add Question'}
      </h1>
      {!!id && !questionData ? (
        <p>
          <Loader />
        </p>
      ) : (
        <div className='flex flex-1'>
          <QuestionAddEditForm id={id} question={questionData} />
        </div>
      )}
    </div>
  );
};

export default QuestionsAddEditPage;
