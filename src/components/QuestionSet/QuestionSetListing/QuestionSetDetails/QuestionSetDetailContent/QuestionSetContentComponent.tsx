import { Content } from '@/models/entities/Content';
import { InfiniteSelect } from '@/shared-resources/InfiniteSelect/InfiniteSelect';
import {
  getContentByIdAction,
  getListContentAction,
} from '@/store/actions/content.actions';
import {
  contentSelector,
  isLoadingContentSelector,
} from '@/store/selectors/content.selector';
import { createEntitySelectorFactory } from '@/store/selectors/root.selectors';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';

type QuestionSetContentComponentPropsProps = {
  contentId?: string;
  setSelectedContentId: (contentId: string | null) => void;
};

const QuestionSetContentComponent = ({
  contentId,
  setSelectedContentId,
}: QuestionSetContentComponentPropsProps) => {
  const dispatch = useDispatch();

  const { result: contentList, totalCount: contentCount } =
    useSelector(contentSelector);
  const isLoadingContent = useSelector(isLoadingContentSelector);

  const [selectedContent, setSelectedContent] = React.useState<Content>();
  const [editContent, setEditContent] = React.useState(!contentId);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const content = useSelector(
    createEntitySelectorFactory('content', contentId ?? '')
  ) as Content;

  useEffect(() => setSelectedContent(content), [content]);

  useEffect(() => {
    if (content?.identifier || !contentId) return;
    dispatch(getContentByIdAction(contentId));
    setSelectedContentId(contentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, selectedContent?.identifier]);

  const handleNextClick = () => {
    if (currentVideoIndex < (selectedContent?.media?.length ?? 0) - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBackClick = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className='flex flex-col px-1 over'>
      <p className='font-medium text-sm text-primary mb-1'>Content</p>
      {!editContent ? (
        <div className='flex items-center gap-5'>
          <p className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base truncate max-w-full'>
            {selectedContent?.name?.en}
          </p>
          <Pencil
            onClick={() => setEditContent(true)}
            className='fill-primary w-5 text-primary cursor-pointer'
          />
        </div>
      ) : (
        <div className='flex flex-col gap-1 mb-2 overflow-x-hidden'>
          <InfiniteSelect
            key={selectedContent?.identifier}
            placeholder='Select Content'
            data={contentList}
            labelKey='name.en'
            valueKey='identifier'
            dispatchAction={(payload) =>
              getListContentAction({
                filters: {
                  search_query: payload.value,
                  page_no: payload.page_no,
                },
              })
            }
            isLoading={isLoadingContent}
            totalCount={contentCount}
            preLoadedOptions={[selectedContent]}
            onChange={(v) => {
              setSelectedContent(v);
              setSelectedContentId(v?.identifier);
              setCurrentVideoIndex(0);
            }}
          />
        </div>
      )}
      {selectedContent && (
        <div className='flex flex-col gap-3 mt-5'>
          <div className='flex gap-3 w-full'>
            <div className='flex flex-1 justify-center items-center'>
              <div className='flex items-center justify-between w-full h-full'>
                <button
                  className='text-gray-600 hover:text-gray-800 disabled:opacity-50'
                  onClick={handleBackClick}
                  disabled={currentVideoIndex === 0}
                >
                  <ChevronLeft className='w-10 h-10' />
                </button>
                <div className='flex-1 h-full'>
                  <ReactPlayer
                    url={selectedContent?.media?.[currentVideoIndex]?.url}
                    controls
                    width='100%'
                    height='100%'
                    className='rounded-lg overflow-hidden'
                  />
                </div>

                <button
                  className='text-gray-600 hover:text-gray-800 disabled:opacity-50'
                  onClick={handleNextClick}
                  disabled={
                    currentVideoIndex ===
                    (selectedContent?.media.length ?? 0) - 1
                  }
                >
                  <ChevronRight className='w-10 h-10' />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default QuestionSetContentComponent;
