import { SkillType } from '@/models/enums/skillType.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import FormikSelect from '@/shared-resources/FormikSelect/FormikSelect';
import { getListBoardAction } from '@/store/actions/board.action';
import { getListClassAction } from '@/store/actions/class.action';
import { getListRepositoryAction } from '@/store/actions/repository.action';
import { getListSkillAction } from '@/store/actions/skill.action';
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
} from '@/store/selectors/skill.selector';
import { Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import { PopoverClose } from '@radix-ui/react-popover';
import * as _ from 'lodash';
import { createEntitySelectorFactory } from '@/store/selectors/root.selectors';
import { Button } from '../ui/button';

type QuestionSetFiltersProps = {
  searchFilters: any;
  setSearchFilters: any;
};

const QuestionSetFilters = ({
  searchFilters,
  setSearchFilters,
}: QuestionSetFiltersProps) => {
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

  const isLoadingSkills = useSelector(isLoadingSkillsSelector);
  const isLoadingBoard = useSelector(isLoadingBoardsSelector);
  const isLoadingRepository = useSelector(isLoadingRepositoriesSelector);
  const isLoadingClass = useSelector(isLoadingClassesSelector);
  const isLoadingSkill = useSelector(isLoadingSkillsSelector);

  const selectedL1Skill = useSelector(
    createEntitySelectorFactory('skill', searchFilters.l1_skill_id)
  );
  const selectedL2Skill = useSelector(
    createEntitySelectorFactory('skill', searchFilters.l2_skill_id)
  );
  const selectedBoard = useSelector(
    createEntitySelectorFactory('board', searchFilters.board_id)
  );
  const selectedRepository = useSelector(
    createEntitySelectorFactory('repository', searchFilters.repository_id)
  );
  const selectedClass = useSelector(
    createEntitySelectorFactory('class', searchFilters.class_id)
  );

  return (
    <Formik
      initialValues={{
        search_query: searchFilters.search_query ?? '',
        board_id: searchFilters.board_id ?? '',
        class_id: searchFilters.class_id ?? '',
        l1_skill_id: searchFilters.l1_skill_id ?? '',
        l2_skill_id: searchFilters.l2_skill_id ?? '',
        repository_id: searchFilters.repository_id ?? '',
        status: searchFilters.status ?? '',
      }}
      onSubmit={(values) => {
        setSearchFilters({
          ..._.omitBy(values, (v) => !v),
          page_no: 1,
        });
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col overflow-x-hidden p-3'
        >
          <h2 className='mb-3 font-bold uppercase'>Filters</h2>
          <FormikInput
            name='search_query'
            label='Title'
            placeholder='Search by title or description'
          />
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
              preLoadedOptions={[selectedBoard]}
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
              preLoadedOptions={[selectedRepository]}
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
              preLoadedOptions={[selectedClass]}
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
              preLoadedOptions={[selectedL1Skill]}
            />
          </div>
          <div className='flex w-full gap-6 items-start'>
            <FormikInfiniteSelect
              name='l2_skill_id'
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
              preLoadedOptions={[selectedL2Skill]}
            />
            <FormikSelect
              name='status'
              label='Status'
              placeholder='Select status'
              options={['LIVE', 'DRAFT'].map((status) => ({
                value: status.toLowerCase(),
                label: status,
              }))}
              renderValue={(status) => (status as string)?.toUpperCase()}
            />
          </div>
          <div className='flex justify-end'>
            <PopoverClose asChild>
              <div className='w-min flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setSearchFilters({
                      page_no: 1,
                    });
                  }}
                >
                  Reset
                </Button>
                <Button type='submit' disabled={!formik.dirty}>
                  Apply
                </Button>
              </div>
            </PopoverClose>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default QuestionSetFilters;
