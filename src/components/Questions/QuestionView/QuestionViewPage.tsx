import React from 'react';
import { QuestionType } from '@/models/enums/QuestionType.enum';
import { operationMap } from '@/models/enums/ArithmaticOperations.enum';
import MCQQuestionView from './MCQQuestionView';
import { QuestionViewPropsType } from './QuestionViewUtils';
import FIBQuestionView from './FIBQuestionView';
import QuestionViewContainer from './QuestionViewContainer';
import Grid2QuestionView from './Grid2QuestionView';
import Grid1QuestionView from './Grid1QuestionView';

interface QuestionViewPageProps {
  question: QuestionViewPropsType | null;
}

const QuestionViewPage: React.FC<QuestionViewPageProps> = ({ question }) => {
  if (!question) {
    return <p>No data available for this question.</p>;
  }

  return (
    <QuestionViewContainer
      headerText={
        question.questionType === QuestionType.GRID_2
          ? `${question.description?.en}: ${Object.values(
              question?.numbers
            )?.join(operationMap[question?.operation])}`
          : question.description?.en || ''
      }
    >
      <div className='flex flex-col space-y-4 items-start'>
        {question.questionType === QuestionType.MCQ && (
          <MCQQuestionView question={question} />
        )}
        {question.questionType === QuestionType.FIB && (
          <FIBQuestionView question={question} />
        )}
        {question.questionType === QuestionType.GRID_2 && (
          <Grid2QuestionView question={question} />
        )}
        {question.questionType === QuestionType.GRID_1 && (
          <Grid1QuestionView question={question} />
        )}
      </div>
    </QuestionViewContainer>
  );
};

export default QuestionViewPage;
