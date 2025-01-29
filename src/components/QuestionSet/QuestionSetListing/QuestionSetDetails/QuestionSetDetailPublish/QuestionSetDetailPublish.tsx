import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isQuestionSetActionInProgressSelector } from '@/store/selectors/questionSet.selector';
import { Button } from '@/components/ui/button';
import { navigateTo } from '@/store/actions/navigation.action';
import {
  publishQuestionSetAction,
  updateQuestionSetAction,
} from '@/store/actions/questionSet.actions';
import { QuestionOrderType } from '@/lib/utils';
import { ArrowLeft, Plus } from 'lucide-react';
import QuestionSetContentUploadForm from '@/components/QuestionSetContentUploadForm/QuestionSetContentUploadForm';
import { resetMediaUploadStateAction } from '@/store/actions/media.actions';
import { toReadableFormat } from '@/utils/helpers/helper';
import { QuestionSet } from '@/models/entities/QuestionSet';
import QuestionSetQuestionReorderComponent from './QuestionSetQuestionReorderComponent';
import QuestionSetContentComponent from '../QuestionSetDetailContent/QuestionSetContentComponent';

type QuestionSetDetailPublishProps = {
  questionSet: QuestionSet;
};

const QuestionSetDetailPublish = ({
  questionSet,
}: QuestionSetDetailPublishProps) => {
  const dispatch = useDispatch();

  const [questionsOrder, setQuestionsOrder] = useState<QuestionOrderType[]>(
    questionSet?.questions?.map((item) => ({
      identifier: item.identifier,
      description: item.description,
      taxonomy: item.taxonomy,
      question_type: item.question_type,
      question_body: item.question_body,
      x_id: item.x_id,
    })) ?? []
  );

  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );

  const isActionInProgress = useSelector(isQuestionSetActionInProgressSelector);

  useEffect(() => {
    const questions = questionSet?.questions ?? [];
    // Early exit if lengths don't match
    if (questionsOrder.length !== questions.length) {
      setIsOrderUpdated(true);
      return;
    }

    // Early exit if both are empty
    if (questionsOrder.length === 0 && questions.length === 0) {
      setIsOrderUpdated(false);
      return;
    }

    // Check if any identifiers differ
    const hasUpdated = questionsOrder.some(
      (order, index) => order.identifier !== questions[index]?.identifier
    );

    setIsOrderUpdated(hasUpdated);
  }, [questionSet, questionsOrder]);

  const dataObject = [
    {
      label: 'Title',
      value: questionSet?.title?.en,
      hasValue: Boolean(questionSet?.title?.en),
    },
    {
      label: 'Repository',
      value: questionSet?.repository?.name?.en,
      hasValue: Boolean(questionSet?.repository?.name?.en),
    },
    {
      label: 'Board',
      value: questionSet?.taxonomy?.board?.name?.en,
      hasValue: Boolean(questionSet?.taxonomy?.board?.name?.en),
    },
    {
      label: 'Class',
      value: toReadableFormat(questionSet?.taxonomy?.class?.name?.en),
      hasValue: Boolean(questionSet?.taxonomy?.class?.name?.en),
    },
    {
      label: 'L1 Skill',
      value: questionSet?.taxonomy?.l1_skill?.name?.en,
      hasValue: Boolean(questionSet?.taxonomy?.l1_skill?.name?.en),
    },
    {
      label: 'L2 Skills',
      value: questionSet?.taxonomy?.l2_skill?.length
        ? questionSet.taxonomy.l2_skill?.map((l2) => l2.name.en).join(', ')
        : '--',
      hasValue: Boolean(questionSet?.taxonomy?.l2_skill?.length),
    },
    {
      label: 'L3 Skills',
      value: questionSet?.taxonomy?.l3_skill?.length
        ? questionSet.taxonomy.l3_skill.map((l3) => l3.name.en).join(', ')
        : '--',
      hasValue: Boolean(questionSet?.taxonomy?.l3_skill?.length),
    },
    {
      label: 'Purpose',
      value: questionSet?.purpose,
      hasValue: Boolean(questionSet?.purpose),
    },
  ];

  const handleSaveQuestionSet = () => {
    setIsFormSubmitted(true);
    dispatch(
      updateQuestionSetAction({
        questionSetId: questionSet?.identifier,
        data: {
          questions: questionsOrder.map((item, index) => ({
            identifier: item.identifier,
            sequence: index + 1,
          })),
          content_ids: selectedContentId ? [selectedContentId] : [],
        },
      })
    );
  };

  return (
    <div className='p-4 h-full gap-3 w-full flex flex-col max-h-[calc(100vh_-_48px)] bg-white shadow rounded-md'>
      <div className='flex-1 flex gap-3 overflow-hidden'>
        <div className='flex-1 flex flex-col overflow-y-auto pr-3'>
          <h1 className='text-2xl font-bold mb-4 flex items-center gap-6'>
            <ArrowLeft
              className='h-8 w-8 cursor-pointer'
              onClick={() => dispatch(navigateTo('/app/question-sets'))}
            />
            Question Set - Details
          </h1>
          <div className='grid grid-cols-2 md:grid-cols-2 gap-6'>
            {dataObject.map((item) => (
              <div key={item.label}>
                <h2 className='text-sm font-bold uppercase'>{item.label}</h2>
                <p className='text-lg text-gray-700'>
                  {item.hasValue ? item.value : '--'}
                </p>
              </div>
            ))}
          </div>
          <div>
            <h1 className='text-2xl font-bold my-5 flex justify-between items-center'>
              Question Set - Content
              <Button onClick={() => setIsNewUpload(true)}>
                <Plus /> New
              </Button>
            </h1>
            <QuestionSetContentComponent
              setSelectedContentId={setSelectedContentId}
              contentId={questionSet?.content_ids?.[0]}
            />
          </div>
        </div>
        <div className='w-0.5 bg-slate-400 h-full' />
        <div className='flex-1 flex flex-col'>
          <QuestionSetQuestionReorderComponent
            questionsOrder={questionsOrder}
            questionSet={questionSet}
            setQuestionsOrder={setQuestionsOrder}
          />
        </div>
      </div>
      <div className='flex justify-between flex-row-reverse'>
        <div className='flex gap-3'>
          <Button
            size='lg'
            variant='outline'
            onClick={() => dispatch(navigateTo('/app/question-sets'))}
            disabled={isActionInProgress}
          >
            Cancel
          </Button>
          <Button
            size='lg'
            disabled={
              isActionInProgress ||
              !(
                isOrderUpdated ||
                Boolean(questionSet.content_ids?.[0]) !==
                  Boolean(selectedContentId)
              ) ||
              isFormSubmitted
            }
            onClick={handleSaveQuestionSet}
          >
            Save
          </Button>
        </div>
        {questionSet?.status === 'draft' && (
          <Button
            size='lg'
            disabled={isActionInProgress}
            onClick={() =>
              dispatch(publishQuestionSetAction(questionSet?.identifier))
            }
          >
            Publish
          </Button>
        )}
      </div>
      <QuestionSetContentUploadForm
        open={isNewUpload}
        onClose={() => {
          setIsNewUpload(false);
          dispatch(resetMediaUploadStateAction());
        }}
        questionSet={questionSet}
      />
    </div>
  );
};

export default QuestionSetDetailPublish;
