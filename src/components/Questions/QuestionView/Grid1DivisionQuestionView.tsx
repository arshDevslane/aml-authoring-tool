/* eslint-disable  react/no-array-index-key */

import React from 'react';

import {
  ArithmaticOperations,
  operationMap,
} from '@/models/enums/ArithmaticOperations.enum';
import { QuestionViewPropsType } from './QuestionViewUtils';

interface Grid1DivisionQuestionViewProps {
  question: QuestionViewPropsType;
}

const Grid1DivisionQuestionView = ({
  question,
}: Grid1DivisionQuestionViewProps) => {
  const { answers, numbers } = question;

  const renderDivisor = () => (
    <div className='flex mt-20 pt-1 pr-4'>
      <div className='flex justify-end'>
        <div className='w-[46px] h-[61px] text-center font-bold text-[36px] px-2'>
          {numbers.n2}
        </div>
      </div>
    </div>
  );

  const renderQuotient = () => (
    <div className='flex mb-4 space-x-3 ml-2'>
      {answers.answerQuotient
        ?.split('')
        ?.map((value: string, index: number) => (
          <div
            key={`answerQuotient-${index}`}
            className='flex justify-center items-center border-2 border-gray-900 rounded-[10px] w-[46px] h-[61px] text-center font-bold text-[36px] focus:outline-none focus:border-primary'
          >
            {value === 'B' ? '' : value}
          </div>
        ))}
    </div>
  );

  const renderDividend = () => (
    <div className='flex border-t-2 border-l-2 border-gray-900 p-2 space-x-3'>
      {String(numbers.n1)
        .split('')
        .map((digit, index) => (
          <div
            key={index}
            className='w-[46px] h-[40px] text-center font-bold text-[36px] px-2'
          >
            {digit}
          </div>
        ))}
    </div>
  );

  const renderRemainder = () => (
    <div className='flex mt-4 justify-start space-x-3 ml-2.5'>
      {answers.answerRemainder
        ?.split('')
        .map((value: string, index: number) => {
          const shouldRenderEmptySpace = value === '#';

          if (shouldRenderEmptySpace) {
            return (
              <div key={`values-${index}`} className='w-[46px] h-[61px]' />
            );
          }
          return (
            <div
              key={`answerRemainder-${index}`}
              className='flex justify-center items-center border-2 border-gray-900 rounded-[10px] w-[46px] h-[61px] text-center font-bold text-[36px] focus:outline-none focus:border-primary'
            >
              {['#', 'B'].includes(value) ? '' : value}
            </div>
          );
        })}
    </div>
  );
  function getStepValue(
    isEditable: boolean,
    answers: any,
    idx: number,
    stepIdx: number,
    step: string
  ) {
    if (!isEditable) return step;

    const answerValue = answers.answerIntermediate?.[idx]?.[stepIdx];
    return ['B', '|'].includes(answerValue) ? '' : answerValue;
  }
  const renderDivisionIntermediateSteps = () => {
    const parts = answers.answerIntermediate.split('|');
    return parts.map((stepGroup, idx) => {
      const steps = stepGroup.split('');
      const inputBoxes = steps.map((step, stepIdx) => {
        const isEditable = step === 'B';
        const isBlank = step === '#';

        // Common logic for determining if an index is even and step is a number or 'B'
        const isEvenAndNumberOrBlank = (_step: string, _idx: number) =>
          (_step === 'B' || /[0-9]/.test(_step)) && _idx % 2 === 0;

        // Determine if a dash should be rendered at this step
        const renderMinusSign =
          isEvenAndNumberOrBlank(step, idx) &&
          stepIdx === 0 &&
          !steps.includes('#');

        // Determine if `#` should be a `-`
        const shouldRenderDash =
          isBlank && isEvenAndNumberOrBlank(steps[stepIdx + 1], idx);
        if (shouldRenderDash) {
          return (
            <div
              key={`${idx}-${stepIdx}`}
              className='w-[46px] h-[61px] text-center font-bold text-[36px]'
            >
              {operationMap[ArithmaticOperations.SUBTRACTION]}
            </div>
          );
        }

        // Render empty space for other `#` characters
        if (isBlank) {
          return (
            <div key={`${idx}-${stepIdx}`} className='w-[46px] h-[61px]' />
          );
        }

        // Render the input box or static value
        return (
          <div key={`${idx}-${stepIdx}`} className='relative'>
            {((idx === 0 && stepIdx === 0) || renderMinusSign) && (
              <div className='absolute left-[-30px] top-1/2 transform -translate-y-1/2 font-bold text-[36px]'>
                {operationMap[ArithmaticOperations.SUBTRACTION]}
              </div>
            )}
            <div
              key={`answerIntermediate.${idx}.${stepIdx}`}
              className='flex justify-center items-center border-2 border-gray-900 rounded-[10px] w-[46px] h-[61px] text-center font-bold text-[36px] focus:outline-none focus:border-primary'
            >
              {getStepValue(isEditable, answers, idx, stepIdx, step)}
            </div>
          </div>
        );
      });

      return (
        <div key={idx} className='mt-2'>
          <div className='flex space-x-3 ml-2.5'>{inputBoxes}</div>
          {(idx === 0 || idx % 2 === 0) && (
            <div className='border-[1px] border-gray-900 mt-2' />
          )}
        </div>
      );
    });
  };

  return (
    <div className='flex'>
      {renderDivisor()}
      <div>
        {renderQuotient()}
        {renderDividend()}
        <div className='space-y-4'>{renderDivisionIntermediateSteps()}</div>
        {renderRemainder()}
      </div>
    </div>
  );
};

export default Grid1DivisionQuestionView;
