import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '@/utils/helpers/helper';

type VideoPlayerProps = {
  videos: { url: string }[];
  initialIndex?: number;
};

const AMLVideoPlayer: React.FC<VideoPlayerProps> = ({
  videos,
  initialIndex = 0,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentVideoIndex(initialIndex);
  }, [initialIndex]);

  if (!videos.length) return null;

  const handleNextClick = () => {
    if (currentVideoIndex < (videos.length ?? 0) - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBackClick = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className='flex flex-col gap-3 mt-5'>
      <div className='flex gap-3 w-full'>
        <div className='flex flex-1 justify-center items-center'>
          <div className='flex items-center justify-between w-full h-full'>
            {videos.length > 1 && (
              <button
                className='text-gray-600 hover:text-gray-800 disabled:opacity-50'
                onClick={handleBackClick}
                disabled={currentVideoIndex === 0}
              >
                <ChevronLeft className='w-10 h-10' />
              </button>
            )}
            <div className='flex-1 h-full'>
              <ReactPlayer
                url={getMediaUrl(videos[currentVideoIndex].url)}
                controls
                width='100%'
                height='100%'
                className='rounded-lg overflow-hidden'
              />
            </div>
            {videos.length > 1 && (
              <button
                className='text-gray-600 hover:text-gray-800 disabled:opacity-50'
                onClick={handleNextClick}
                disabled={currentVideoIndex === videos.length - 1}
              >
                <ChevronRight className='w-10 h-10' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMLVideoPlayer;
