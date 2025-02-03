/* eslint-disable  react/no-array-index-key */
import React from 'react';
import { operationMap } from '@/models/enums/ArithmaticOperations.enum';
import { DIGIT_PLACES, QuestionViewPropsType } from './QuestionViewUtils';

interface Grid2QuestionViewProps {
  question: QuestionViewPropsType;
}

const Grid2QuestionView: React.FC<Grid2QuestionViewProps> = ({ question }) => {
  const { operation, numbers } = question;

  const maxLength = Math.max(
    ...Object.values(numbers).map((num) => (String(num) || '').length)
  );

  return (
    <div>
      {/* Digit Places Header */}
      <div className='flex justify-center'>
        <div className='w-[75px] p-4 border border-gray-900 flex items-center justify-center font-bold text-[36px]' />
        {Array.from({ length: maxLength }).map((_, index) => (
          <div
            key={index}
            className='w-[80px] h-[95px] p-4 border text-digitTextColor border-gray-900 flex items-center justify-center font-bold text-[24px]'
          >
            {DIGIT_PLACES[maxLength - 1 - index] || ''}
          </div>
        ))}
      </div>

      {/* Row 1 Display */}
      <div className='flex'>
        <div className='w-[75px] p-4 border border-gray-900 flex items-center justify-center font-bold text-[36px]' />
        {Array.from({ length: maxLength }).map((value: any, index: any) => (
          <div
            key={`row-1-${index}`}
            className='w-[80px] h-[95px] p-4 border border-gray-900  flex items-center justify-center font-bold text-[24px]'
          >
            <div className='w-[46px] h-[61px] flex items-center justify-center text-[36px] font-bold border-2 border-gray-900 rounded-[10px] text-center focus:outline-none focus:border-primary'>
              {value === '#' ? '' : value}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 Display */}
      <div className='flex'>
        <div className='w-[75px] p-4 border border-gray-900 flex items-center justify-center font-bold text-[36px]'>
          {operationMap[operation]}
        </div>
        {Array.from({ length: maxLength }).map((value: any, index: any) => (
          <div
            key={`row-2-${index}`}
            className='w-[80px] h-[95px] p-4 border border-gray-900 flex items-center justify-center font-bold text-[24px]'
          >
            <div className='w-[46px] h-[61px] flex items-center justify-center text-[36px] font-bold border-2 border-gray-900 rounded-[10px] text-center focus:outline-none focus:border-primary'>
              {value === '#' ? '' : value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid2QuestionView;
