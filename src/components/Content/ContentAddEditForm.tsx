/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/components/ui/button';
import { Board } from '@/models/entities/Board';
import { SkillType } from '@/models/enums/skillType.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import MediaUpload from '@/shared-resources/MediaUpload/MediaUpload';
import MultiLangFormikInput, {
  useMultiLanguage,
} from '@/shared-resources/MultiLangFormikInput/MultiLangFormikInput';
import { getListBoardAction } from '@/store/actions/board.action';
import { getListClassAction } from '@/store/actions/class.action';
import {
  createContentAction,
  getContentByIdAction,
  updateContentAction,
} from '@/store/actions/content.actions';
import { getListRepositoryAction } from '@/store/actions/repository.action';
import { getListSkillAction } from '@/store/actions/skill.action';
import {
  boardSelector,
  getAllBoardsSelector,
  isLoadingBoardsSelector,
} from '@/store/selectors/board.selector';
import {
  classesSelector,
  isLoadingClassesSelector,
} from '@/store/selectors/class.selector';
import { allContentSelector } from '@/store/selectors/content.selector';
import {
  isLoadingRepositoriesSelector,
  repositoriesSelector,
} from '@/store/selectors/repository.selector';
import {
  isLoadingSkillsSelector,
  l1SkillSelector,
  l2SkillSelector,
  l3SkillSelector,
} from '@/store/selectors/skill.selector';
import { getMultiLangFormikInitialValues } from '@/utils/helpers/helper';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

type ContentDetailsProps = {
  onClose: () => void;
  contentId: string | null;
};

const ContentListDetail = ({ onClose, contentId }: ContentDetailsProps) => {
  const dispatch = useDispatch();
  const allContent = useSelector(allContentSelector);
  const content = allContent[contentId!];
  const preSelectedBoards = useSelector(
    getAllBoardsSelector([content?.taxonomy?.board?.identifier])
  );
  const [selectedBoard, setSelectedBoard] = React.useState<Board | undefined>(
    preSelectedBoards.length ? preSelectedBoards[0] : undefined
  );
  const { supportedLanguages, multiLanguageSchemaObject } =
    useMultiLanguage(selectedBoard);
  const { result: boards, totalCount: boardsCount } =
    useSelector(boardSelector);

  const { result: classes, totalCount: classesCount } =
    useSelector(classesSelector);
  const { result: repositories, totalCount: repositoriesCount } =
    useSelector(repositoriesSelector);
  const { result: l1Skills, totalCount: l1SkillsCount } =
    useSelector(l1SkillSelector);
  const { result: l2Skills, totalCount: l2SkillsCount } =
    useSelector(l2SkillSelector);
  const { result: l3Skills, totalCount: l3SkillsCount } =
    useSelector(l3SkillSelector);

  const isLoadingBoard = useSelector(isLoadingBoardsSelector);
  const isLoadingClass = useSelector(isLoadingClassesSelector);
  const isLoadingRepository = useSelector(isLoadingRepositoriesSelector);
  const isLoadingSkill = useSelector(isLoadingSkillsSelector);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);

  const validationSchema = yup.object().shape({
    name: yup.object().shape(multiLanguageSchemaObject('name')),
    description: yup.object().shape(multiLanguageSchemaObject('description')),
    repository_id: yup.string().required().label('Repository'),
    board_id: yup.string().required().label('Board'),
    class_id: yup.string().required().label('Class'),
    l1_skill_id: yup.string().required().label('L1 Skill'),
    mediaObjects: yup.array().min(1).required(),
  });

  React.useEffect(() => {
    if (contentId) {
      dispatch(getContentByIdAction(contentId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  useEffect(() => {
    if (isFormSubmitted) {
      setIsFormSubmitted(false);
      onClose();
    }
  }, [isFormSubmitted, onClose]);

  return (
    <Formik
      initialValues={{
        name: getMultiLangFormikInitialValues(content?.name),
        description: getMultiLangFormikInitialValues(content?.description),
        board_id: content?.taxonomy?.board?.identifier ?? '',
        class_id: content?.taxonomy?.class?.identifier ?? '',
        repository_id: content?.repository?.identifier ?? '',
        l1_skill_id: content?.taxonomy?.l1_skill?.identifier ?? '',
        l2_skill_ids: content?.taxonomy?.l2_skill?.map(
          (skill) => skill.identifier
        ),
        l3_skill_ids: content?.taxonomy?.l3_skill?.map(
          (skill) => skill.identifier
        ),
        files: [],
        mediaObjects: content?.media ?? [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setIsFormSubmitted(true);

        const payload = {
          name: values.name,
          description: values.description,
          board_id: values.board_id,
          repository_id: values.repository_id,
          class_id: values.class_id,
          l1_skill_id: values.l1_skill_id,
          l2_skill_ids: values.l2_skill_ids,
          l3_skill_ids: values.l3_skill_ids,
          media: values.mediaObjects.map(({ url, ...rest }) => rest),
        };
        if (content) {
          dispatch(
            updateContentAction({
              contentId: contentId!,
              data: payload,
            })
          );
        } else {
          dispatch(createContentAction(payload));
        }
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col overflow-x-hidden px-1'
        >
          <p className='text-2xl font-bold mb-8'>
            {content ? 'Update - Content' : 'Create - Content'}
          </p>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='board_id'
              label='Board'
              placeholder='Select Board'
              data={boards}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListBoardAction({
                  filters: {
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingBoard}
              totalCount={boardsCount}
              onValueChange={(value) => setSelectedBoard(value)}
              preLoadedOptions={[content?.taxonomy?.board]}
              required
            />
            <FormikInfiniteSelect
              name='class_id'
              label='Class'
              placeholder='Select Class'
              data={classes}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListClassAction({
                  filters: {
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingClass}
              totalCount={classesCount}
              preLoadedOptions={[content?.taxonomy?.class]}
              required
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='repository_id'
              label='Repository'
              placeholder='Select Repository'
              data={repositories}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListRepositoryAction({
                  filters: {
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingRepository}
              totalCount={repositoriesCount}
              preLoadedOptions={[content?.repository]}
              required
            />
            <FormikInfiniteSelect
              name='l1_skill_id'
              label='L1 Skill'
              placeholder='Select L1 skill'
              data={l1Skills}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListSkillAction({
                  filters: {
                    skill_type: SkillType.L1Skill,
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingSkill}
              totalCount={l1SkillsCount}
              preLoadedOptions={[content?.taxonomy?.l1_skill]}
              required
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='l2_skill_ids'
              label='L2 Skill'
              placeholder='Select L2 skills'
              data={l2Skills}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListSkillAction({
                  filters: {
                    skill_type: SkillType.L2Skill,
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingSkill}
              totalCount={l2SkillsCount}
              preLoadedOptions={content?.taxonomy?.l2_skill}
              multiple
            />
            <FormikInfiniteSelect
              name='l3_skill_ids'
              label='L3 Skill'
              placeholder='Select L3 skills'
              data={l3Skills}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListSkillAction({
                  filters: {
                    skill_type: SkillType.L3Skill,
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingSkill}
              totalCount={l3SkillsCount}
              preLoadedOptions={content?.taxonomy?.l3_skill}
              multiple
            />
          </div>
          <MultiLangFormikInput
            name='name'
            label='Name'
            supportedLanguages={supportedLanguages}
          />
          <MultiLangFormikInput
            name='description'
            label='Description'
            supportedLanguages={supportedLanguages}
          />
          <div>
            {content?.media?.length && (
              <div className='flex flex-col gap-4'>
                {content?.media?.map((video) => (
                  <ReactPlayer
                    key={video.src}
                    url={video.url}
                    controls
                    width='90%'
                    height='80%'
                    className='rounded-lg overflow-hidden'
                  />
                ))}
              </div>
            )}
            <MediaUpload
              onUploadComplete={(data) => {
                formik.setFieldValue('mediaObjects', [
                  ...formik.values.mediaObjects,
                  ...data,
                ]);
              }}
              multiple
              value={formik.values.files}
              setValue={(files) => formik.setFieldValue('files', files)}
              category='content'
              acceptedFiles={{
                'video/*': [],
              }}
            />
          </div>
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

export default ContentListDetail;
