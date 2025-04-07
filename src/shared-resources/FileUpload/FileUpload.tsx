import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  multiple: boolean;
  value: File[];
  setValue: (files: File[]) => void;
  acceptedFiles?: any;
  uploadProgress?: Record<string, number>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  multiple,
  value,
  setValue,
  acceptedFiles,
  uploadProgress = {},
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

  const removeFile = (fileName: string) => {
    setValue(value.filter((file) => file.name !== fileName));
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex-1 border-[1px] rounded-md border-dashed border-primary/50 p-5 text-center',
        isDragActive ? 'bg-primary/10' : 'bg-white'
      )}
    >
      <input {...getInputProps()} />
      <p className='text-primary'>
        {isDragActive
          ? 'Drop the files here...'
          : `Drag & drop your ${
              multiple ? 'files' : 'file'
            } here, or click to select`}
      </p>

      {value?.length > 0 && (
        <div className='mt-4 border-[1px] border-dashed border-primary/50 rounded-md p-3 bg-primary/10'>
          {Object.keys(uploadProgress)?.length > 0 && (
            <div className='mb-2 text-sm font-semibold text-primary'>
              Upload Progress: {uploadProgress[value[0].name] ?? 0}%
            </div>
          )}

          <div>
            {value.map((file) => (
              <div
                className='flex items-center justify-between font-semibold py-1 px-3 rounded-md border-2 my-1 bg-white border-input'
                key={file.name}
              >
                <span>{file.name}</span>
                <X
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the drop zone
                    removeFile(file.name);
                  }}
                  className='text-red-500 hover:text-red-700 cursor-pointer'
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
