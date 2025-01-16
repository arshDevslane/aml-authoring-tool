import React from 'react';
import { QuestionType } from '@/models/enums/QuestionType.enum';
import MCQQuestionView from './MCQQuestionView';
import { QuestionViewPropsType } from './QuestionViewUtils';

interface QuestionViewPageProps {
  question: QuestionViewPropsType | null;
}

const QuestionViewPage: React.FC<QuestionViewPageProps> = ({ question }) => {
  if (!question) {
    return <p>No data available for this question.</p>;
  }

  console.log('HERE', question);

  return (
    <div className='flex flex-1 md:flex-row flex-col min-h-0 items-center justify-center'>
      <div className='md:w-[75%]'>
        <div className='flex-1 flex-col max-h-[540px] overflow-y-auto transition-all shadow-[0_0_0_1px_black] animation-borderFadeIn mt-6 flex justify-center items-center'>
          <div className='p-10 h-full [&_>_div:first-child]:py-6 grid place-items-center'>
            <div className='text-4xl font-semibold text-headingTextColor'>
              {question.questionType === QuestionType.MCQ && (
                <MCQQuestionView question={question} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionViewPage;
