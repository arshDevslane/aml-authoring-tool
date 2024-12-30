import React from 'react';
import { useErrorBoundary } from 'react-error-boundary';

const ErrorFallbackComponent: React.FC = () => {
  const { resetBoundary } = useErrorBoundary();
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        <p className='text-[2rem] flex items-center'>Something went wrong!</p>
        <button
          onClick={resetBoundary}
          className='text-white text-base override:w-40 override:h-12 override:mt-2'
        >
          Please Try Again.
        </button>
      </div>
    </div>
  );
};

export default ErrorFallbackComponent;
