/* eslint-disable  no-unsafe-optional-chaining */
import React from 'react';
import { ImageRenderer } from '@/components/ImageRenderer';
import { useImageLoader } from '@/hooks/useImageLoader';
import cx from 'classnames';
import { QuestionViewPropsType } from './QuestionViewUtils';

interface MCQQuestionViewProps {
  question: QuestionViewPropsType;
}

const MCQQuestionView: React.FC<MCQQuestionViewProps> = ({ question }) => {
  const {
    isImageLoading,
    isImageReady,
    imgError,
    handleImageLoad,
    setImgError,
  } = useImageLoader(question?.questionImageUrl);
  console.log('QUE', question);

  return (
    <div>
      {!!question.options && (
        <div className='flex flex-col space-y-2 justify-center items-center'>
          <span className='mb-6 font-normal'>{question.name?.en}</span>

          <ImageRenderer
            imageUrl={question.questionImageUrl || ''}
            isImageLoading={isImageLoading}
            isImageReady={isImageReady}
            imgError={imgError}
            onImageLoad={handleImageLoad}
            onImageError={() => setImgError(true)}
          />

          <div className='!grid grid-cols-2 gap-x-[58px] gap-y-8 justify-self-center'>
            {question.options.map((option: string, index: number) => (
              <button
                key={option}
                className={cx(
                  `w-[236px] !py-2 !border-2 !m-0 !border-black !rounded-2xl !text-4xl !font-semibold !text-black !font-publicSans`,
                  question.options &&
                    question?.options?.length % 2 !== 0 &&
                    index === question.options.length - 1
                    ? 'col-span-2 justify-self-center'
                    : ''
                )}
                disabled
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQQuestionView;
