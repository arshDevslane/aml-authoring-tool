import React from 'react';

import cx from 'classnames';
import { useImageLoader } from '@/hooks/useImageLoader';
import {
  ArithmaticOperations,
  operationMap,
} from '@/models/enums/ArithmaticOperations.enum';
import { FibType } from '@/models/enums/QuestionType.enum';
import { ImageRenderer } from '@/components/ImageRenderer';
import { QuestionViewPropsType } from './QuestionViewUtils';

interface FIBQuestionViewProps {
  question: QuestionViewPropsType;
}

const FIBQuestionView: React.FC<FIBQuestionViewProps> = ({ question }) => {
  const { answers } = question;
  const {
    isImageLoading,
    isImageReady,
    imgError,
    handleImageLoad,
    setImgError,
  } = useImageLoader(question?.questionImageUrl);

  const shouldRenderQuotientRemainderDivisionFib =
    question.operation === ArithmaticOperations.DIVISION &&
    answers.fib_type === FibType.FIB_QUOTIENT_REMAINDER;

  const shouldRenderFibWithImage =
    answers.fib_type === FibType.FIB_STANDARD_WITH_IMAGE;

  const renderFibContent = () => {
    if (!shouldRenderFibWithImage) {
      return (
        <p className='text-4xl font-semibold text-gray-700 pt-[23px] pb-[22px] px-[7px]'>
          {Object.values(question?.numbers || {}).join(
            operationMap[question.operation]
          )}{' '}
          =
        </p>
      );
    }
    return (
      <ImageRenderer
        imageUrl={question.questionImageUrl || ''}
        isImageLoading={isImageLoading}
        isImageReady={isImageReady}
        imgError={imgError}
        onImageLoad={handleImageLoad}
        onImageError={() => setImgError(true)}
      />
    );
  };

  return (
    <div>
      {shouldRenderQuotientRemainderDivisionFib && (
        <div className='flex flex-col items-center justify-center relative'>
          {renderFibContent()}
          <div className='flex flex-col space-y-5 mt-8'>
            <div className='flex justify-between items-center'>
              <h1 className='text-gray-900'>Quotient</h1>
              <div className='border-2 border-gray-900 rounded-[10px] !w-[236px] h-[61px] text-center font-bold text-[36px] focus:outline-none focus:border-primary  px-4 py-2 ml-4 '>
                {answers.answerQuotient}
              </div>
            </div>

            <div className='flex justify-between items-center space-x-6'>
              <h1 className='text-gray-900'>Remainder</h1>
              <div className='border-2 border-gray-900 rounded-[10px] !w-[236px] h-[61px] text-center font-bold text-[36px] focus:outline-none focus:border-primary  px-4 py-2 ml-4 '>
                {answers.answerRemainder}
              </div>
            </div>
          </div>
        </div>
      )}
      {!shouldRenderQuotientRemainderDivisionFib && (
        <div
          className={cx(
            `flex items-center justify-center relative`,
            shouldRenderFibWithImage ? 'flex-col' : 'flex-row'
          )}
        >
          {renderFibContent()}
          <div className='border-2 border-gray-900 rounded-[10px] !w-[236px] h-[61px] text-center font-bold text-[36px] focus:outline-none focus:border-primary  px-4 py-2 ml-4 ' />
        </div>
      )}
    </div>
  );
};

export default FIBQuestionView;
