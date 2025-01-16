/* eslint-disable react/no-array-index-key, react/jsx-no-useless-fragment, jsx-a11y/label-has-associated-control, react-hooks/rules-of-hooks, @typescript-eslint/naming-convention, react/no-this-in-sfc, func-names */
import React, { useEffect, useMemo, useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import FormikSelect from '@/shared-resources/FormikSelect/FormikSelect';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  cleanQuestionBody,
  enumToSelectOptions,
  getMultiLangFormikInitialValues,
} from '@/utils/helpers/helper';
import { FibType, QuestionType } from '@/models/enums/QuestionType.enum';
import { ArithmaticOperations } from '@/models/enums/ArithmaticOperations.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListBoardAction } from '@/store/actions/board.action';
import { useDispatch, useSelector } from 'react-redux';
import {
  boardSelector,
  isLoadingBoardsSelector,
} from '@/store/selectors/board.selector';
import {
  classesSelector,
  isLoadingClassesSelector,
} from '@/store/selectors/class.selector';
import {
  isLoadingSkillsSelector,
  l1SkillSelector,
  l2SkillSelector,
  l3SkillSelector,
} from '@/store/selectors/skill.selector';
import {
  isLoadingSubSkillsSelector,
  subSkillsSelector,
} from '@/store/selectors/subskill.selector';
import {
  isLoadingRepositoriesSelector,
  repositoriesSelector,
} from '@/store/selectors/repository.selector';
import { Board } from '@/models/entities/Board';
import {
  SupportedLanguages,
  SupportedLanguagesLabel,
} from '@/models/enums/SupportedLanguages.enum';
import { Question } from '@/models/entities/Question';
import { getListRepositoryAction } from '@/store/actions/repository.action';
import { getListSkillAction } from '@/store/actions/skill.action';
import { SkillType } from '@/models/enums/skillType.enum';
import { getListSubSkillAction } from '@/store/actions/subSkill.action';
import MultiLangFormikInput from '@/shared-resources/MultiLangFormikInput/MultiLangFormikInput';
import { getListClassAction } from '@/store/actions/class.action';
import { Switch } from '@/components/ui/switch';
import {
  createQuestionAction,
  updateQuestionAction,
} from '@/store/actions/question.action';
import MediaUpload from '@/shared-resources/MediaUpload/MediaUpload';
import { useImageLoader } from '@/hooks/useImageLoader';
import { navigateTo } from '@/store/actions/navigation.action';
import Loader from '../Loader/Loader';
import { ImageRenderer } from '../ImageRenderer';

interface QuestionAddEditFormProps {
  id?: string;
  question?: Question | null;
}

const QuestionAddEditForm: React.FC<QuestionAddEditFormProps> = ({
  id,
  question,
}) => {
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const [files, setFiles] = useState<any>();
  const {
    isImageLoading,
    isImageReady,
    imgError,
    handleImageLoad,
    setImgError,
  } = useImageLoader(question?.question_body.question_image_url);
  const initialValues = {
    // Base
    repository_id: question?.repository.identifier ?? '',
    board_id: question?.taxonomy?.board.identifier ?? '',
    class_id: question?.taxonomy?.class.identifier ?? '',
    l1_skill_id: question?.taxonomy?.l1_skill.identifier ?? '',
    l2_skill_ids: question?.taxonomy?.l2_skill?.map(
      (skill) => skill.identifier
    ),
    l3_skill_ids: question?.taxonomy?.l3_skill?.map(
      (skill) => skill.identifier
    ),
    sub_skill_ids: question?.sub_skills?.map((skill) => skill?.identifier),
    operation: question?.operation ?? '',
    question_type: question?.question_type ?? '',
    benchmark_time: question?.benchmark_time ?? '',
    gradient: question?.gradient ?? '',

    // Multi-lang
    name: getMultiLangFormikInitialValues(question?.name),
    description: getMultiLangFormikInitialValues(question?.description),

    // Question body
    question_body: {
      numbers: question?.question_body?.numbers || { n1: '', n2: '' },
      grid1_show_carry: question?.question_body?.grid1_show_carry ?? false,
      grid1_show_regroup: question?.question_body?.grid1_show_regroup ?? false,
      grid1_pre_fills_top: question?.question_body?.grid1_pre_fills_top ?? '',
      grid1_pre_fills_result:
        question?.question_body?.grid1_pre_fills_result ?? '',
      grid1_multiply_intermediate_steps_prefills:
        question?.question_body.grid1_multiply_intermediate_steps_prefills ??
        '',
      grid1_pre_fills_quotient:
        question?.question_body?.grid1_pre_fills_quotient ?? '',
      grid1_pre_fills_remainder:
        question?.question_body?.grid1_pre_fills_remainder ?? '',
      grid1_div_intermediate_steps_prefills:
        question?.question_body?.grid1_div_intermediate_steps_prefills ?? '',
      options: question?.question_body?.options ?? [''],
      correct_option: question?.question_body?.correct_option ?? '',
      fib_type: question?.question_body?.answers?.fib_type ?? '',
      fib_answer: question?.question_body?.fib_answer ?? '',
    },
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
  const isLoadingSubSkill = useSelector(isLoadingSubSkillsSelector);

  const supportedLanguages = useMemo(() => {
    const res = {} as { [k: string]: boolean };
    const requiredLangs = Object.keys(selectedBoard?.supported_lang ?? {});

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
    return res;
  }, [selectedBoard]);
  const multiLanguageSchemaObject = (label: string) =>
    Object.values(SupportedLanguages).reduce((schema, lang) => {
      if (supportedLanguages[lang]) {
        schema[lang] = Yup.string()
          .required()
          .label(`${SupportedLanguagesLabel[lang]} ${label}`);
      } else {
        schema[lang] = Yup.string().label(
          `${SupportedLanguagesLabel[lang]} ${label}`
        );
      }
      return schema;
    }, {} as Record<SupportedLanguages, Yup.StringSchema>);

  const validationSchema = Yup.object().shape({
    name: Yup.object().shape(multiLanguageSchemaObject('name')),
    description: Yup.object().shape(multiLanguageSchemaObject('description')),

    question_type: Yup.string().required('Required'),
    operation: Yup.string().required('Required'),
    benchmark_time: Yup.number().required('Required').positive(),
    repository_id: Yup.string().required('Required'),
    board_id: Yup.string().required('Required'),
    class_id: Yup.string().required('Required'),
    l1_skill_id: Yup.string().required('Required'),
    question_body: Yup.object().shape({
      numbers: Yup.object().shape({
        n1: Yup.string()
          .nullable()
          .test('n1-required', 'N1 is required', function (fieldVal) {
            const { question_type, question_body } = this.options
              .context as any;
            const fib_type = question_body?.fib_type;
            return !(
              ([QuestionType.GRID_1, QuestionType.GRID_2].includes(
                question_type
              ) ||
                [FibType.FIB_STANDARD, FibType.FIB_QUOTIENT_REMAINDER].includes(
                  fib_type
                )) &&
              !fieldVal
            );
          }),
        n2: Yup.string()
          .nullable()
          .test('n2-required', 'N2 is required', function (fieldVal) {
            const { question_type, question_body } = this.options
              .context as any;
            const fib_type = question_body?.fib_type;
            return !(
              ([QuestionType.GRID_1, QuestionType.GRID_2].includes(
                question_type
              ) ||
                [FibType.FIB_STANDARD, FibType.FIB_QUOTIENT_REMAINDER].includes(
                  fib_type
                )) &&
              !fieldVal
            );
          }),
      }),
      options: Yup.array()
        .of(Yup.string().required('Option is required'))
        .test(
          'options-required',
          'At least one option is required',
          function (fieldVal) {
            const { question_type } = this.options.context as any;
            return !(
              question_type === QuestionType.MCQ &&
              (!fieldVal || fieldVal.length === 0)
            );
          }
        ),
      correct_option: Yup.string()
        .nullable()
        .test(
          'correct-option-required',
          'Correct option is required',
          function (fieldVal) {
            const { question_type } = this.options.context as any;
            return !(question_type === QuestionType.MCQ && !fieldVal);
          }
        ),
      fib_type: Yup.string()
        .nullable()
        .test('fib-type-required', 'Fib type is required', function (fieldVal) {
          const { question_type } = this.options.context as any;
          return !(question_type === QuestionType.FIB && !fieldVal);
        }),
      fib_answer: Yup.string()
        .nullable()
        .test(
          'fib-answer-required',
          'Fib answer is required',
          function (fieldVal) {
            const { question_type, question_body } = this.options
              .context as any;
            const fib_type = question_body?.fib_type;
            return !(
              question_type === QuestionType.FIB &&
              fib_type === FibType.FIB_STANDARD_WITH_IMAGE &&
              !fieldVal
            );
          }
        ),
      grid1_show_carry: Yup.boolean().test(
        'grid1-show-carry-required',
        'Grid 1 show carry is required',
        function (fieldVal) {
          const { operation, question_type } = this.options.context as any;
          return !(
            operation === ArithmaticOperations.ADDITION &&
            question_type === QuestionType.GRID_1 &&
            fieldVal === undefined
          );
        }
      ),
      grid1_show_regroup: Yup.boolean().test(
        'grid1-show-regroup-required',
        'Grid 1 show regroup is required',
        function (fieldVal) {
          const { operation, question_type } = this.options.context as any;
          return !(
            operation === ArithmaticOperations.SUBTRACTION &&
            question_type === QuestionType.GRID_1 &&
            fieldVal === undefined
          );
        }
      ),
      grid1_pre_fills_top: Yup.string()
        .nullable()
        .test(
          'grid1-pre-fills-top-required',
          'Grid 1 prefills top is required',
          function (fieldVal) {
            const { operation, question_type } = this.options.context as any;
            return !(
              [
                ArithmaticOperations.ADDITION,
                ArithmaticOperations.SUBTRACTION,
              ].includes(operation) &&
              question_type === QuestionType.GRID_1 &&
              !fieldVal
            );
          }
        ),
      grid1_pre_fills_result: Yup.string()
        .nullable()
        .test(
          'grid1-pre-fills-result-required',
          'Prefills result is required',
          function (fieldVal) {
            const { operation, question_type } = this.options.context as any;
            return !(
              [
                ArithmaticOperations.ADDITION,
                ArithmaticOperations.SUBTRACTION,
                ArithmaticOperations.MULTIPLICATION,
              ].includes(operation) &&
              question_type === QuestionType.GRID_1 &&
              !fieldVal
            );
          }
        ),
      grid1_pre_fills_quotient: Yup.string()
        .nullable()
        .test(
          'grid1-pre-fills-quotient-required',
          'Grid 1 prefills quotient is required',
          function (fieldVal) {
            const { operation, question_type } = this.options.context as any;
            return !(
              operation === ArithmaticOperations.DIVISION &&
              question_type === QuestionType.GRID_1 &&
              !fieldVal
            );
          }
        ),
      grid1_pre_fills_remainder: Yup.string()
        .nullable()
        .test(
          'grid1-pre-fills-remainder-required',
          'Grid 1 prefills remainder is required',
          function (fieldVal) {
            const { operation, question_type } = this.options.context as any;
            return !(
              operation === ArithmaticOperations.DIVISION &&
              question_type === QuestionType.GRID_1 &&
              !fieldVal
            );
          }
        ),

      grid1_multiply_intermediate_steps_prefills: Yup.string()
        .nullable()
        .test(
          'grid1-multiply-steps-required',
          'Grid 1 multiply intermediate steps prefills are required',
          function (fieldVal) {
            const { question_type, operation, question_body } = this.options
              .context as any;
            return !(
              question_type === QuestionType.GRID_1 &&
              operation === ArithmaticOperations.MULTIPLICATION &&
              question_body?.numbers?.n2?.length > 1 &&
              !fieldVal
            );
          }
        ),
      grid1_div_intermediate_steps_prefills: Yup.string()
        .nullable()
        .test(
          'grid1-division-steps-required',
          'Grid 1 division intermediate steps prefills are required',
          function (fieldVal) {
            const { question_type, operation } = this.options.context as any;
            return !(
              question_type === QuestionType.GRID_1 &&
              operation === ArithmaticOperations.DIVISION &&
              !fieldVal
            );
          }
        ),
    }),
  });

  if (!initialValues) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const renderQuestionBody = (
    formik: any,
    operation: ArithmaticOperations | string,
    questionType: QuestionType | string
  ) => {
    useEffect(() => {
      // Resetting the form on changing operation or questionType
      formik.resetForm({
        values: {
          ...formik.values,
          question_body: { ...formik.initialValues.question_body }, // reset question body only
        },
      });
    }, [operation, questionType]);

    const imageUploadAndRendering = (
      <>
        {question?.question_body.question_image_url ? (
          <ImageRenderer
            imageUrl={question?.question_body.question_image_url || ''}
            isImageLoading={isImageLoading}
            isImageReady={isImageReady}
            imgError={imgError}
            onImageLoad={handleImageLoad}
            onImageError={() => setImgError(true)}
          />
        ) : (
          <MediaUpload
            onUploadComplete={(data) => {
              formik.setFieldValue('question_body.question_image', data[0]);
            }}
            multiple={false}
            value={files}
            setValue={(files) => setFiles(files)}
            category='question'
            acceptedFiles={{
              'image/*': [],
            }}
          />
        )}
      </>
    );
    const grid1PreFillsResultInput = (
      <>
        <FormikInput
          name='question_body.grid1_pre_fills_result'
          type='text'
          label='Prefills Result'
          required
        />
      </>
    );
    const commonFields = (
      <>
        <FormikInput
          name='question_body.grid1_pre_fills_top'
          type='text'
          label='Pre Fill Top'
        />

        {grid1PreFillsResultInput}
      </>
    );
    const numberFields = (
      <>
        <FormikInput name='question_body.numbers.n1' label='N1' required />
        <FormikInput name='question_body.numbers.n2' label='N2' required />
      </>
    );

    const renderFibTypeForm = (fibType: FibType) => {
      if (
        fibType === FibType.FIB_STANDARD ||
        fibType === FibType.FIB_QUOTIENT_REMAINDER
      ) {
        return <>{numberFields}</>;
      }
      if (fibType === FibType.FIB_STANDARD_WITH_IMAGE) {
        return (
          <>
            {imageUploadAndRendering}
            <FormikInput
              name='question_body.fib_answer'
              label='Fib answer'
              required
            />
          </>
        );
      }
      return null;
    };
    if (questionType === QuestionType.FIB) {
      return (
        <>
          <FormikSelect
            name='question_body.fib_type'
            label='Choose fib type'
            options={enumToSelectOptions(FibType)}
            required
          />
          {renderFibTypeForm(formik.values.question_body.fib_type)}
        </>
      );
    }
    if (questionType === QuestionType.GRID_2) {
      return <>{numberFields}</>;
    }
    if (questionType === QuestionType.MCQ) {
      return (
        <>
          {imageUploadAndRendering}
          <FieldArray name='question_body.options'>
            {({ push, remove }) => (
              <div className='flex flex-col gap-2'>
                {formik.values.question_body.options.map(
                  (_: any, index: any) => (
                    <div key={index} className='flex items-center gap-2'>
                      <FormikInput
                        name={`question_body.options.${index}`}
                        label={`Option ${index + 1}`}
                      />
                      {index === 0 && (
                        <Plus
                          type='button'
                          className='text-blue-500 mt-4 cursor-pointer'
                          onClick={() => push('')}
                        />
                      )}
                      {index > 0 && (
                        <X
                          type='button'
                          className='text-red-500 mt-4 cursor-pointer'
                          onClick={() => {
                            formik.setFieldValue(
                              'question_body.correct_option',
                              ''
                            );
                            remove(index);
                          }}
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </FieldArray>
          <FormikSelect
            name='question_body.correct_option'
            label='Correct Option'
            options={formik.values.question_body.options.map(
              (option: any, index: any) => ({
                value: `Option ${index + 1}`,
                label: `Option ${index + 1}: ${option}`,
              })
            )}
            required
          />
        </>
      );
    }
    if (
      operation === ArithmaticOperations.ADDITION &&
      questionType === QuestionType.GRID_1
    ) {
      return (
        <>
          {/* Rendering numbers fields */}
          {numberFields}
          <div>
            <label className='font-medium text-sm flex gap-3 items-center w-fit'>
              <Switch
                checked={formik.values.grid1_show_carry}
                onCheckedChange={(checked) =>
                  formik.setFieldValue(
                    'question_body.grid1_show_carry',
                    checked
                  )
                }
              />
              Grid 1 show carry
            </label>
          </div>
          {/* Common fields */}
          {commonFields}
        </>
      );
    }
    if (
      operation === ArithmaticOperations.SUBTRACTION &&
      questionType === QuestionType.GRID_1
    ) {
      return (
        <>
          {numberFields}
          <div>
            <label className='font-medium text-sm flex gap-3 items-center'>
              <Switch
                checked={formik.values.grid1_show_regroup}
                onCheckedChange={(checked) =>
                  formik.setFieldValue(
                    'question_body.grid1_show_regroup',
                    checked
                  )
                }
              />
              Grid 1 show regroup
            </label>
          </div>
          {/* Common fields */}
          {commonFields}
        </>
      );
    }
    if (
      operation === ArithmaticOperations.MULTIPLICATION &&
      questionType === QuestionType.GRID_1
    ) {
      return (
        <>
          {numberFields}
          <FormikInput
            name='question_body.grid1_multiply_intermediate_steps_prefills'
            label='Grid 1 multiply intermediate steps prefills'
            required={formik.values.question_body?.numbers?.n2?.length > 1}
          />
          {grid1PreFillsResultInput}
        </>
      );
    }
    if (
      operation === ArithmaticOperations.DIVISION &&
      questionType === QuestionType.GRID_1
    ) {
      return (
        <>
          {numberFields}
          <FormikInput
            name='question_body.grid1_div_intermediate_steps_prefills'
            label='Grid 1 division intermediate steps prefills'
          />
          <FormikInput
            name='question_body.grid1_pre_fills_quotient'
            label='Grid 1 prefills quotient'
            required
          />
          <FormikInput
            name='question_body.grid1_pre_fills_remainder'
            label='Grid 1 prefills remainder'
            required
          />
        </>
      );
    }
    return (
      <div className='w-full text-center'>
        <p className='text-appPrimary animate-bounce'>
          *Please select operation and question type to create question body*
        </p>
      </div>
    );
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Clean up the question_body before submitting
        const cleanedQuestionBody = cleanQuestionBody(
          values.question_body,
          values.operation,
          values.question_type
        );

        // Prepare the payload to submit
        const payload = {
          ...values,
          benchmark_time: Number(values.benchmark_time),
          question_body: cleanedQuestionBody,
        };
        if (isEditMode && id) {
          dispatch(updateQuestionAction({ id, question: payload }));
        } else {
          dispatch(createQuestionAction(payload));
        }
      }}
    >
      {(formik) => (
        <Form className='flex flex-1 flex-col overflow-x-hidden px-1'>
          {/* Left Column */}
          <div className='flex w-full gap-6 items-start overflow-hidden'>
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
              preLoadedOptions={[question?.taxonomy?.board]}
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
              required
              preLoadedOptions={[question?.repository]}
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
              required
              preLoadedOptions={[question?.taxonomy?.class]}
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
              required
              preLoadedOptions={[question?.taxonomy?.l1_skill]}
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
              isLoading={isLoadingSkills}
              totalCount={l2SkillsCount}
              multiple
              preLoadedOptions={question?.taxonomy?.l2_skill}
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
              isLoading={isLoadingSkills}
              totalCount={l3SkillsCount}
              multiple
              preLoadedOptions={question?.taxonomy?.l3_skill}
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='sub_skill_ids'
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
              preLoadedOptions={question?.sub_skills}
            />
          </div>

          <MultiLangFormikInput
            name='name'
            label='Question text'
            supportedLanguages={supportedLanguages}
          />
          <MultiLangFormikInput
            name='description'
            label='Description'
            supportedLanguages={supportedLanguages}
          />
          <div className='flex w-full gap-6 items-start'>
            <FormikInput
              name='benchmark_time'
              label='Benchmark Time (seconds)'
              type='string'
              required
            />
            <FormikInput name='gradient' label='Gradient' type='string' />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikSelect
              name='operation'
              label='Operation'
              options={enumToSelectOptions(ArithmaticOperations)}
              required
            />
            <FormikSelect
              name='question_type'
              label='Question Type'
              placeholder='Select type'
              options={enumToSelectOptions(QuestionType)}
              required
            />
          </div>
          {/* Conditionally render the question body */}
          <div className='col-span-2'>
            <h3 className='font-bold text-lg text-primary mb-4'>
              Question Body
            </h3>
            {renderQuestionBody(
              formik,
              formik.values.operation,
              formik.values.question_type
            )}
          </div>

          {/* Submit Button */}
          <div className='col-span-2 flex justify-end mt-4 space-x-4'>
            <Button
              variant='outline'
              onClick={() => dispatch(navigateTo('/app/questions'))}
            >
              Cancel
            </Button>
            <Button type='submit'>
              {isEditMode ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default QuestionAddEditForm;
