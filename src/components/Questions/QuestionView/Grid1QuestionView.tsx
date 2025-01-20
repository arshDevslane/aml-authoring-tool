/* eslint-disable  react/no-array-index-key */

import React from 'react';
import {
  ArithmaticOperations,
  operationMap,
} from '@/models/enums/ArithmaticOperations.enum';
import { DIGIT_PLACES, QuestionViewPropsType } from './QuestionViewUtils';
import Grid1DivisionQuestionView from './Grid1DivisionQuestionView';

interface Grid1QuestionViewProps {
  question: QuestionViewPropsType;
}

const Grid1QuestionView: React.FC<Grid1QuestionViewProps> = ({ question }) => {
  const { answers, numbers } = question;
  const maxLength = Math.max(
    ...Object.values(numbers).map((num) => (num || '').length)
  );

  const shouldRenderDivisionGrid1 =
    question.operation === ArithmaticOperations.DIVISION;

  const renderExtraSpaces = () => {
    const extraSpacesCount =
      maxLength - (question.answers?.answerResult?.length || 0) > 0
        ? maxLength - (question.answers?.answerResult.length || 0)
        : 0;

    return Array(extraSpacesCount)
      .fill(null)
      .map((_, i) => (
        <div
          key={`extra-space-${i}`}
          className='w-[40px] h-[61px] border-transparent'
        />
      ));
  };

  const renderTopLabels = () => (
    <div className='flex justify-center self-end'>
      {DIGIT_PLACES.slice(0, String(answers?.result)?.length || 1)
        .reverse()
        .map((label, index) => (
          <div
            key={index}
            className='w-[46px] mr-[.35rem] p-2 text-digitTextColor text-center flex items-center justify-center font-bold text-[20px]'
          >
            {label}
          </div>
        ))}
    </div>
  );
  const getAnswerTopArray = (): string[] => {
    const topAnswer =
      question.operation === ArithmaticOperations.SUBTRACTION
        ? answers?.answerTop
            ?.split('|') // Spliting for subtraction
            ?.map((val) => (val === 'B' ? '' : val)) // Handling blank input
        : answers?.answerTop?.split('')?.map((val) => (val === 'B' ? '' : val));
    return topAnswer;
  };
  const renderTopAnswerInputs = () => (
    <div className='flex justify-end space-x-2 self-end'>
      {getAnswerTopArray()?.map((char, index) => (
        <div key={`top-${index}`}>
          {char === '#' ? (
            <div className='w-[46px] h-[61px]' /> // Render blank space
          ) : (
            <div className='w-[46px] h-[61px] flex items-center justify-center text-[36px] font-bold border-2 border-gray-900 rounded-[10px] text-center focus:outline-none focus:border-primary'>
              {char === 'B' ? '' : char}
            </div>
          )}
        </div>
      ))}
      {question.operation === ArithmaticOperations.ADDITION && (
        <div className='w-12 h-10 flex items-center justify-center font-bold text-[36px]' />
      )}
    </div>
  );

  const renderNumbers = () => (
    <div className='flex flex-col space-y-2 self-end'>
      {Object.keys(numbers).map((key, idx) => (
        <div key={key} className='flex justify-end space-x-2'>
          {String(numbers[key])
            ?.split('')
            ?.map((digit, index) => (
              <div
                key={index}
                className='w-[46px] h-10 flex items-center justify-center font-bold text-[36px] relative'
              >
                {digit}
                {question.operation === ArithmaticOperations.SUBTRACTION &&
                  !!answers.isPrefil &&
                  idx === 0 &&
                  getAnswerTopArray()?.[index] !== '#' && (
                    <div className='absolute inset-0'>
                      <div className='absolute w-full h-0 border-t-4 border-dotted border-red-700 rotate-45 top-1/2 -translate-y-1/2' />
                    </div>
                  )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );

  const renderIntermediateSteps = () => {
    if (
      question.operation !== ArithmaticOperations.MULTIPLICATION ||
      !answers?.isIntermediatePrefill ||
      !answers?.answerIntermediate
    ) {
      return null;
    }

    return (
      <div className='flex flex-col space-y-2 self-end'>
        {answers?.answerIntermediate?.split('#').map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className='flex justify-end space-x-2'>
            {row.split('').map((char, index) => (
              <div
                key={`intermediate-${rowIndex}-${index}`}
                className='w-[46px] h-[61px] flex items-center justify-center text-[36px] font-bold border-2 border-gray-900 rounded-[10px] text-center focus:outline-none focus:border-primary'
              >
                {char === 'B' ? '' : char}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderResultAnswers = () => (
    <div className='flex space-x-2'>
      {renderExtraSpaces()}
      <div className='w-12 h-10 flex items-center justify-center font-bold text-[36px]' />
      {answers?.answerResult?.split('')?.map((value, index) => (
        <div key={`result-${index}`}>
          <div className='w-[46px] h-[61px] flex items-center justify-center text-[36px] font-bold border-2 border-gray-900 rounded-[10px] text-center focus:outline-none focus:border-primary'>
            {value === 'B' ? '' : value}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {shouldRenderDivisionGrid1 && (
        <Grid1DivisionQuestionView question={question} />
      )}
      {!shouldRenderDivisionGrid1 && (
        <>
          {/* Top labels */}

          {renderTopLabels()}
          {/* Top answer inputs */}

          {answers?.isPrefil && renderTopAnswerInputs()}
          {/* Numbers */}

          {renderNumbers()}

          {/* Separator */}

          <div className='w-full relative'>
            <span className='absolute bottom-4 left-4'>
              {operationMap[question.operation]}
            </span>
            <hr className='w-full text-black border border-black' />
          </div>
          {/* Intermediate Inputs (Only for Multiplication) */}

          {question.operation === ArithmaticOperations.MULTIPLICATION &&
            renderIntermediateSteps()}

          {/* Separator */}
          {answers?.isIntermediatePrefill && (
            <div className='w-full relative'>
              <span className='absolute bottom-4 left-4'>
                {operationMap[ArithmaticOperations.ADDITION]}
              </span>
              <hr className='w-full text-black border border-black' />
            </div>
          )}
          {/* Result answer inputs */}
          {renderResultAnswers()}
        </>
      )}
    </>
  );
};

export default Grid1QuestionView;
