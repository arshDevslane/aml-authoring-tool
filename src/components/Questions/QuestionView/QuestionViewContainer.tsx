import React from 'react';

interface QuestionViewContainerProps {
  headerText: string;
  children: React.ReactNode;
}

const QuestionViewContainer: React.FC<QuestionViewContainerProps> = ({
  children,
  headerText,
}) => (
  <div className='flex flex-col w-full'>
    <div>
      <div className='flex flex-1 md:flex-row flex-col min-h-0 items-center justify-center'>
        <div className='md:w-[75%]'>
          <div className='md:text-start text-3xl md:text-4xl font-semibold text-gray-700 pt-6 -mb-1'>
            {headerText}
          </div>
        </div>
      </div>
    </div>
    <div className='flex flex-1 md:flex-row flex-col min-h-0 items-center justify-center'>
      <div className='md:w-[75%]'>
        <div className='flex-1 flex-col min-h-[540px] max-h-[540px]  transition-all shadow-[0_0_0_1px_black] animation-borderFadeIn mt-6 flex justify-center items-center'>
          <div className='p-10 overflow-y-auto w-full h-full [&_>_div:first-child]:py-6 grid place-items-center'>
            <div className='text-4xl font-semibold text-gray-700'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default QuestionViewContainer;
