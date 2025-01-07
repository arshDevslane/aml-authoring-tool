/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { QuestionSetPurposeType } from '@/enums/questionSet.enum';
import { Board } from '@/models/entities/Board';
import { SupportedLanguages } from '@/models/enums/SupportedLanguages.enum';
import FormikSelect from '@/shared-resources/FormikSelect/FormikSelect';
import {
  boardSelector,
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
import { subSkillsSelector } from '@/store/selectors/subskill.selector';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import MultiLangFormikInput from '@/shared-resources/MultiLangFormikInput/MultiLangFormikInput';
import { getListSkillAction } from '@/store/actions/skill.action';
import { SkillType } from '@/models/enums/skillType.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListBoardAction } from '@/store/actions/board.action';
import { getListRepositoryAction } from '@/store/actions/repository.action';
import { getListClassAction } from '@/store/actions/class.action';
import { getListSubSkillAction } from '@/store/actions/subSkill.action';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import { allQuestionSetsSelector } from '@/store/selectors/questionSet.selector';

type QuestionSetDetailsProps = {
  onClose: () => void;
  questionSetId: string | null;
};

const QuestionSetDetails = ({
  onClose,
  questionSetId,
}: QuestionSetDetailsProps) => {
  const questionSets = useSelector(allQuestionSetsSelector);
  const questionSet = questionSets[questionSetId!];

  const initialValues = {
    // Base
    repository: questionSet?.repository ?? {},
    board: questionSet?.taxonomy?.board ?? {},
    class: questionSet?.taxonomy?.class ?? {},
    tenant: questionSet?.tenant ?? '',
    l1_skill: questionSet?.taxonomy?.l1_skill ?? {},
    l2_skills: questionSet?.taxonomy?.l2_skill ?? [],
    l3_skills: questionSet?.taxonomy?.l3_skill ?? [],
    sub_skills: questionSet?.sub_skills ?? [],
    content_ids: questionSet?.content_ids ?? [],
    purpose: questionSet?.purpose ?? '',

    // Multi-lang
    title: questionSet?.title ?? {},
    description: questionSet?.description ?? {},
    instruction_text: questionSet?.instruction_text ?? {},

    // other
    enable_feedback: questionSet?.enable_feedback,
    is_atomic: questionSet?.is_atomic,
    sequence: questionSet?.sequence,
    gradient: questionSet?.gradient,
    group_name: questionSet?.group_name,
  };

  const [selectedBoard, setSelectedBoard] = React.useState<Board>();

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
  const { result: subSkills, totalCount: subSkillsCount } =
    useSelector(subSkillsSelector);

  const isLoadingSkills = useSelector(isLoadingSkillsSelector);
  const isLoadingBoard = useSelector(isLoadingBoardsSelector);
  const isLoadingRepository = useSelector(isLoadingRepositoriesSelector);
  const isLoadingClass = useSelector(isLoadingClassesSelector);
  const isLoadingSkill = useSelector(isLoadingSkillsSelector);
  const isLoadingSubSkill = useSelector(isLoadingSkillsSelector);

  const supportedLanguages = useMemo(() => {
    const res = {} as { [k: string]: boolean };
    if (selectedBoard) {
      const requiredLangs = Object.keys(selectedBoard.supported_lang ?? {});

      if (!requiredLangs.includes(SupportedLanguages.EN)) {
        requiredLangs.unshift(SupportedLanguages.EN);
      }
      requiredLangs.forEach((lang) => {
        res[lang] = true;
      });

      Object.values(SupportedLanguages).forEach((lang) => {
        if (!res[lang]) {
          res[lang] = false;
        }
      });
    }
    return res;
  }, [selectedBoard]);

  const validationSchema = yup.object().shape({
    title: yup.string().required().label('Title'),
    description: yup.string().required().label('Description'),
    purpose: yup
      .string()
      .required()
      .oneOf(Object.values(QuestionSetPurposeType))
      .label('Purpose'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={console.log}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col overflow-x-hidden px-1'
        >
          <p className='text-2xl font-bold mb-8'>
            {questionSetId ? 'Edit' : 'New'}
          </p>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='board'
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
              required
            />
            <FormikInfiniteSelect
              name='repository'
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
              required
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='class'
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
              required
            />
            <FormikInfiniteSelect
              name='l1_skill'
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
              required
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='l2_skills'
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
              isLoading={isLoadingSkills}
              totalCount={l2SkillsCount}
              multiple
              required
            />
            <FormikInfiniteSelect
              name='l3_skills'
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
              isLoading={isLoadingSkills}
              totalCount={l3SkillsCount}
              multiple
              required
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='sub_skills'
              label='Sub Skills'
              placeholder='Select sub-skills'
              data={subSkills}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListSubSkillAction({
                  filters: {
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingSubSkill}
              totalCount={subSkillsCount}
              multiple
              required
            />
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
          </div>
          <MultiLangFormikInput
            name='title'
            label='Title'
            supportedLanguages={Object.keys(supportedLanguages)}
          />
          <MultiLangFormikInput
            name='description'
            label='Description'
            supportedLanguages={Object.keys(supportedLanguages)}
          />
          <MultiLangFormikInput
            name='instruction_text'
            label='Description'
            supportedLanguages={Object.keys(supportedLanguages)}
          />
          <div className='flex w-full gap-6 items-start'>
            <FormikInput
              name='sequence'
              label='Sequence'
              type='number'
              placeholder='Sequence'
              required
            />
            <FormikInput
              name='gradient'
              label='Gradient'
              placeholder='Gradient'
              required
            />
            <FormikInput
              name='group_name'
              label='Group Name'
              type='number'
              placeholder='Group Name'
              required
            />
          </div>
          <div className='flex gap-6 items-start my-3'>
            <label className='font-medium text-sm flex gap-3 items-center'>
              <Switch
                checked={formik.values.enable_feedback}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('enable_feedback', checked)
                }
              />
              Enable Feedback
            </label>
            <label className='font-medium text-sm flex gap-3 items-center'>
              <Switch
                checked={formik.values.is_atomic}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('is_atomic', checked)
                }
              />
              Is Atomic
            </label>
          </div>
          <div className='flex gap-5 mt-5'>
            <Button type='submit' size='lg'>
              Save
            </Button>
            <Button variant='outline' onClick={onClose} size='lg'>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default QuestionSetDetails;
