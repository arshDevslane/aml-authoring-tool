/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/components/ui/button';
import { Description } from '@/models/entities/Question';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import {
  createRepositoryAction,
  getRepositoryByIdAction,
  updateRepositoryAction,
} from '@/store/actions/repository.action';
import { allRepositorySelector } from '@/store/selectors/repository.selector';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

type RepositoryDetailsProps = {
  onClose: () => void;
  repositoryId: string | null;
};

export type RepositoryCreateUpdatePayload = {
  name: Description;
  description: Description;
};

const RepositoryAddEditForm = ({
  onClose,
  repositoryId,
}: RepositoryDetailsProps) => {
  const dispatch = useDispatch();
  const allRepository = useSelector(allRepositorySelector);

  const repository = allRepository[repositoryId!];

  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);

  const validationSchema = yup.object().shape({
    name: yup.object().shape({
      en: yup.string().required().label('name'),
    }),
    description: yup.object().shape({
      en: yup.string().required().label('description'),
    }),
  });

  React.useEffect(() => {
    if (repositoryId) {
      dispatch(getRepositoryByIdAction(repositoryId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositoryId]);

  useEffect(() => {
    if (isFormSubmitted) {
      setIsFormSubmitted(false);
      onClose();
    }
  }, [isFormSubmitted, onClose]);

  return (
    <Formik
      initialValues={{
        name: repository?.name,
        description: repository?.description,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setIsFormSubmitted(true);

        const payload = {
          name: values.name,
          description: values.description,
        };
        if (repository) {
          dispatch(
            updateRepositoryAction({
              repositoryId: repositoryId!,
              data: payload,
            })
          );
        } else {
          dispatch(createRepositoryAction(payload));
        }
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col overflow-x-hidden px-1'
        >
          <p className='text-2xl font-bold mb-8'>
            {repository ? 'Update - Repository' : 'Create - Repository'}
          </p>

          <FormikInput name='name.en' label='Name' type='string' required />
          <FormikInput
            name='description.en'
            label='Description'
            type='string'
            required
          />

          <div className='flex gap-5 mt-5 flex-row-reverse'>
            <Button
              type='submit'
              size='lg'
              disabled={!formik.dirty || !formik.isValid}
            >
              Save
            </Button>
            <Button
              variant='outline'
              onClick={onClose}
              size='lg'
              type='button'
              disabled={isFormSubmitted}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default RepositoryAddEditForm;
