import { cn } from '@/lib/utils';
import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  multiple: boolean;
  value: File[];
  setValue: (files: File[]) => void;
  acceptedFiles?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
  multiple,
  value,
  setValue,
  acceptedFiles,
}) => {
  // Restrict file types to only images and videos
  const acceptedFileTypes = {
    'image/*': [],
    'video/*': [],
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (multiple) {
      setValue([...value, ...acceptedFiles]);
    } else {
      setValue(acceptedFiles); // Only keep the first file if single upload
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles ?? acceptedFileTypes,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex-1 border-[1px] rounded-md border-dashed border-primary/50 p-5 text-center',
        isDragActive ? 'bg-primary/10' : 'bg-white'
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-primary'>Drop the files here...</p>
      ) : (
        <p className='text-primary'>
          Drag & drop your {multiple ? 'files' : 'file'} here, or click to
          select
        </p>
      )}
      <div className='mt-2'>
        {value?.length > 0 &&
          value.map((file) => (
            <div
              className='font-semibold py-1 px-3 rounded-md border-2 my-1 bg-primary/30 border-input'
              key={file.name}
            >
              {file.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
