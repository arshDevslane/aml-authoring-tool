/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { QuestionSetPurposeType } from '@/enums/questionSet.enum';
import { Board } from '@/models/entities/Board';
import FormikSelect from '@/shared-resources/FormikSelect/FormikSelect';
import {
  boardSelector,
  getAllBoardsSelector,
  isLoadingBoardsSelector,
} from '@/store/selectors/board.selector';
import {
  classesSelector,
  isLoadingClassesSelector,
} from '@/store/selectors/class.selector';
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
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import MultiLangFormikInput, {
  useMultiLanguage,
} from '@/shared-resources/MultiLangFormikInput/MultiLangFormikInput';
import { getListSkillAction } from '@/store/actions/skill.action';
import { SkillType } from '@/models/enums/skillType.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListBoardAction } from '@/store/actions/board.action';
import { getListRepositoryAction } from '@/store/actions/repository.action';
import { getListClassAction } from '@/store/actions/class.action';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import {
  allQuestionSetsSelector,
  isQuestionSetActionInProgressSelector,
} from '@/store/selectors/questionSet.selector';
import { Description } from '@/models/entities/Question';
import {
  createQuestionSetAction,
  updateQuestionSetAction,
} from '@/store/actions/questionSet.actions';
import { cn } from '@/lib/utils';
import { getMultiLangFormikInitialValues } from '@/utils/helpers/helper';

type QuestionSetDetailsProps = {
  onClose: () => void;
  questionSetId: string | null;
};

export type QuestionSetCreateUpdatePayload = {
  title: Description;
  instruction_text: Description;
  repository_id: string;
  sequence?: number;
  board_id: string;
  class_id: string;
  l1_skill_id: string;
  l2_skill_ids?: string[];
  l3_skill_ids?: string[];
  sub_skill_ids?: string[];
  purpose: string;
  is_atomic: boolean;
  enable_feedback: boolean;
  questions: { identifier: string; sequence?: number }[];
  gradient?: string;
  group_name?: number;
};

const QuestionSetDetails = ({
  onClose,
  questionSetId,
}: QuestionSetDetailsProps) => {
  const dispatch = useDispatch();
  const questionSets = useSelector(allQuestionSetsSelector);
  const isActionInProgress = useSelector(isQuestionSetActionInProgressSelector);
  const questionSet = questionSets[questionSetId!];

  const preSelectedBoards = useSelector(
    getAllBoardsSelector([questionSet?.taxonomy?.board?.identifier])
  );

  const [selectedBoard, setSelectedBoard] = React.useState<Board | undefined>(
    preSelectedBoards.length ? preSelectedBoards[0] : undefined
  );
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);

  const { supportedLanguages, multiLanguageSchemaObject } =
    useMultiLanguage(selectedBoard);

  const { result: repositories, totalCount: repositoriesCount } =
    useSelector(repositoriesSelector);
  const { result: boards, totalCount: boardsCount } =
    useSelector(boardSelector);
  const { result: classes, totalCount: classesCount } =
    useSelector(classesSelector);
  const { result: l1Skills, totalCount: l1SkillsCount } =
    useSelector(l1SkillSelector);
  const { result: l2Skills, totalCount: l2SkillsCount } =
    useSelector(l2SkillSelector);
  const { result: l3Skills, totalCount: l3SkillsCount } =
    useSelector(l3SkillSelector);

  const isLoadingBoard = useSelector(isLoadingBoardsSelector);
  const isLoadingRepository = useSelector(isLoadingRepositoriesSelector);
  const isLoadingClass = useSelector(isLoadingClassesSelector);
  const isLoadingSkill = useSelector(isLoadingSkillsSelector);

  const validationSchema = yup.object().shape({
    title: yup.object().shape(multiLanguageSchemaObject('title')),
    instruction_text: yup.string().required().label('Instruction Text'),
    repository_id: yup.string().required().label('Repository'),
    board_id: yup.string().required().label('Board'),
    class_id: yup.string().required().label('Class'),
    l1_skill_id: yup.string().required().label('L1 Skill'),
    sequence: yup.number().label('Sequence'),
    purpose: yup
      .string()
      .required()
      .oneOf(Object.values(QuestionSetPurposeType))
      .label('Purpose'),
  });

  useEffect(() => {
    if (!isActionInProgress && isFormSubmitted) {
      setIsFormSubmitted(false);
      onClose();
    }
  }, [isFormSubmitted, isActionInProgress, onClose]);

  return (
    <Formik
      initialValues={{
        // Base
        repository_id: questionSet?.repository?.identifier ?? '',
        board_id: questionSet?.taxonomy?.board?.identifier ?? '',
        class_id: questionSet?.taxonomy?.class?.identifier ?? '',
        l1_skill_id: questionSet?.taxonomy?.l1_skill?.identifier ?? '',
        l2_skill_ids: questionSet?.taxonomy?.l2_skill?.map(
          (skill) => skill.identifier
        ),
        l3_skill_ids: questionSet?.taxonomy?.l3_skill?.map(
          (skill) => skill.identifier
        ),
        content_ids: questionSet?.content_ids ?? [],
        purpose: questionSet?.purpose ?? '',

        // Multi-lang
        title: getMultiLangFormikInitialValues(questionSet?.title),
        instruction_text: questionSet?.instruction_text ?? '',

        // other
        enable_feedback:
          questionSet?.purpose !== QuestionSetPurposeType.MAIN_DIAGNOSTIC &&
          questionSet?.enable_feedback,
        is_atomic: questionSet?.is_atomic,
        sequence: questionSet?.sequence,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setIsFormSubmitted(true);
        const payload = {
          title: values.title,
          instruction_text: values.instruction_text,
          repository_id: values.repository_id,
          board_id: values.board_id,
          class_id: values.class_id,
          l1_skill_id: values.l1_skill_id,
          l2_skill_ids: values.l2_skill_ids,
          l3_skill_ids: values.l3_skill_ids,
          purpose: values.purpose,
          enable_feedback: Boolean(
            values?.purpose !== QuestionSetPurposeType.MAIN_DIAGNOSTIC &&
              values?.enable_feedback
          ),
          is_atomic: false,
        };

        if (questionSet) {
          dispatch(
            updateQuestionSetAction({
              questionSetId: questionSet.identifier,
              data: { ...payload, sequence: +values.sequence },
            })
          );
        } else {
          dispatch(createQuestionSetAction(payload));
        }
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col overflow-x-hidden px-1'
        >
          <p className='text-2xl font-bold mb-8'>
            {questionSetId ? 'Update - Question Set' : 'Create - Question Set'}
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
              preLoadedOptions={preSelectedBoards}
              required
            />
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
              preLoadedOptions={[questionSet?.repository]}
              required
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
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
              preLoadedOptions={[questionSet?.taxonomy?.class]}
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
              preLoadedOptions={[questionSet?.taxonomy?.l1_skill]}
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
              preLoadedOptions={questionSet?.taxonomy?.l2_skill}
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
              preLoadedOptions={questionSet?.taxonomy?.l3_skill}
              multiple
            />
          </div>
          <div className='flex w-full [&_>_div]:flex-1 gap-6 items-start'>
            <FormikSelect
              name='purpose'
              label='Purpose'
              placeholder='Select purpose'
              options={Object.values(QuestionSetPurposeType).map((purpose) => ({
                value: purpose,
                label: purpose,
              }))}
              required
            />
            {questionSetId && (
              <FormikInput
                name='sequence'
                label='Sequence'
                type='number'
                placeholder='Sequence'
                required
              />
            )}
          </div>
          <MultiLangFormikInput
            name='title'
            label='Title'
            supportedLanguages={supportedLanguages}
          />

          <FormikInput
            name='instruction_text'
            label='Instruction Text'
            placeholder='Instruction Text'
            required
          />
          <div className='flex gap-6 items-start my-3'>
            <label className='font-medium text-sm flex gap-3 items-center'>
              <Switch
                checked={
                  formik.values.purpose !==
                    QuestionSetPurposeType.MAIN_DIAGNOSTIC &&
                  formik.values.enable_feedback
                }
                onCheckedChange={(checked) =>
                  formik.setFieldValue('enable_feedback', checked)
                }
                disabled={
                  !formik.values.purpose ||
                  formik.values.purpose ===
                    QuestionSetPurposeType.MAIN_DIAGNOSTIC
                }
              />
              <span
                className={cn(
                  (!formik.values.purpose ||
                    formik.values.purpose ===
                      QuestionSetPurposeType.MAIN_DIAGNOSTIC) &&
                    'text-disabled'
                )}
              >
                Enable Feedback
              </span>
            </label>
          </div>
          <div className='flex gap-5 mt-5 flex-row-reverse'>
            <Button type='submit' size='lg' disabled={!formik.dirty}>
              {questionSetId ? 'Update' : 'Create'}
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

export default QuestionSetDetails;
