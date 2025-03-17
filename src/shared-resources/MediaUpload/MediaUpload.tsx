import { Media } from '@/models/entities/Content';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPresignedUrlAction,
  uploadAction,
} from '@/store/actions/media.actions';
import {
  isLoadingPresignedUrlsSelector,
  isUploadInProgressSelector,
  presignedUrlsSelector,
  uploadErrorSelector,
  uploadProgressSelector,
} from '@/store/selectors/media.selector';
import FileUpload from '../FileUpload/FileUpload';

type MediaUploadProps = {
  onUploadComplete: (media: Media[]) => void;
  multiple: boolean;
  value: File[];
  setValue: (files: File[]) => void;
  category: string;
  acceptedFiles?: any;
};

const MediaUpload = ({
  onUploadComplete,
  multiple,
  value,
  setValue,
  category,
  acceptedFiles,
}: MediaUploadProps) => {
  const dispatch = useDispatch();
  const [uploadClicked, setUploadClicked] = React.useState(false);

  const isGeneratingPresignedUrls = useSelector(isLoadingPresignedUrlsSelector);
  const isUploadInProgress = useSelector(isUploadInProgressSelector);
  const uploadProgress = useSelector(uploadProgressSelector);
  const presignedUrls = useSelector(presignedUrlsSelector);
  const uploadError = useSelector(uploadErrorSelector);

  useEffect(() => {
    if (!uploadClicked || uploadError) return;

    if (
      isGeneratingPresignedUrls ||
      isUploadInProgress ||
      Object.keys(presignedUrls).length === 0
    )
      return;

    const uploadMap = Object.keys(presignedUrls)
      .map((fileName) => ({
        signedUrl: presignedUrls[fileName].url,
        file: value.find((file) => file.name === fileName)!,
      }))
      .filter((item) => Boolean(item.file));

    dispatch(uploadAction(uploadMap));
    setUploadClicked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGeneratingPresignedUrls, isUploadInProgress]);

  useEffect(() => {
    if (isUploadInProgress || uploadError || value?.length === 0) return;

    setUploadClicked(false);
    onUploadComplete(
      Object.values(presignedUrls).map((data: any) => data.media)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadInProgress]);

  const onUploadClick = () => {
    setUploadClicked(true);
    dispatch(
      getPresignedUrlAction(
        value.map((file) => ({
          fileName: file.name,
          category,
        }))
      )
    );
  };
  return (
    <div className='flex flex-col gap-3 my-6'>
      <div className='flex items-center gap-3 justify-between'>
        <FileUpload
          multiple={multiple}
          value={value}
          setValue={setValue}
          acceptedFiles={acceptedFiles}
          uploadProgress={uploadProgress}
        />
        <Button
          type='button'
          onClick={onUploadClick}
          disabled={
            isGeneratingPresignedUrls ||
            isUploadInProgress ||
            Boolean(uploadError) ||
            Object.keys(presignedUrls).length === value?.length ||
            !value.length
          }
        >
          Upload
        </Button>
      </div>
      {uploadError && (
        <p className='text-red-500'>
          Unable to upload files at the moment. Please try again later.
        </p>
      )}
    </div>
  );
};

export default MediaUpload;
