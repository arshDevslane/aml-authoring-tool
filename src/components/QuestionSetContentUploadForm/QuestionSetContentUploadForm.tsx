import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import { QuestionSet } from '@/models/entities/QuestionSet';
import MediaUpload from '@/shared-resources/MediaUpload/MediaUpload';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Description } from '@/models/entities/Question';
import { createContentAction } from '@/store/actions/content.actions';
import { isContentActionInProgressSelector } from '@/store/selectors/content.selector';
import { Media } from '@/models/entities/Content';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

type QuestionSetContentUploadFormPropsContentUploadFormProps = {
  open: boolean;
  onClose: () => void;
  questionSet: QuestionSet;
};

export type ContentCreateUpdatePayload = {
  name: Description;
  description: Description;
  repository_id: string;
  board_id: string;
  class_id: string;
  l1_skill_id: string;
  l2_skill_ids: string[];
  l3_skill_ids: string[];
  sub_skill_ids: string[];
  media: Media[];
};

const QuestionSetContentUploadForm = ({
  open,
  onClose,
  questionSet,
}: QuestionSetContentUploadFormPropsContentUploadFormProps) => {
  const dispatch = useDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const isActionInProgress = useSelector(isContentActionInProgressSelector);

  useEffect(() => {
    if (!isFormSubmitted || isActionInProgress) return;
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormSubmitted, isActionInProgress]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[50%] max-h-[95%] overflow-y-auto'>
        <DialogHeader>Content Upload Form</DialogHeader>
        <Formik
          initialValues={{
            name: '',
            description: '',
            files: [],
            mediaObjects: [],
          }}
          validationSchema={yup.object().shape({
            name: yup.string().required('Name is required'),
            description: yup.string().required('Description is required'),
            mediaObjects: yup.array().min(1).required(),
          })}
          onSubmit={(values) => {
            const payload: ContentCreateUpdatePayload = {
              name: {
                en: values.name,
              },
              description: {
                en: values.description,
              },
              repository_id: questionSet?.repository?.identifier,
              board_id: questionSet?.taxonomy?.board?.identifier,
              class_id: questionSet?.taxonomy?.class?.identifier,
              l1_skill_id: questionSet?.taxonomy?.l1_skill?.identifier,
              l2_skill_ids:
                questionSet?.taxonomy?.l2_skill?.map(
                  (skill) => skill.identifier
                ) ?? [],
              l3_skill_ids:
                questionSet?.taxonomy?.l3_skill?.map(
                  (skill) => skill.identifier
                ) ?? [],
              sub_skill_ids:
                questionSet?.sub_skills?.map((skill) => skill.identifier) ?? [],
              media: values.mediaObjects,
            };
            dispatch(createContentAction(payload));
            setIsFormSubmitted(true);
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <FormikInput name='name' label='Name' required />
              <FormikInput name='description' label='Description' required />
              <MediaUpload
                onUploadComplete={(data) =>
                  formik.setFieldValue('mediaObjects', data)
                }
                multiple
                value={formik.values.files}
                setValue={(files) => formik.setFieldValue('files', files)}
                category='content'
                acceptedFiles={{
                  'video/*': [],
                }}
              />
              <div className='flex w-full justify-end'>
                <Button
                  type='submit'
                  size='lg'
                  disabled={!formik.dirty || !formik.isValid}
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSetContentUploadForm;
