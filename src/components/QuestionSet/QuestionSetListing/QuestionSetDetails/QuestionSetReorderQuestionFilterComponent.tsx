import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SkillType } from '@/models/enums/skillType.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListClassAction } from '@/store/actions/class.action';
import { getListSkillAction } from '@/store/actions/skill.action';
import {
  classesSelector,
  isLoadingClassesSelector,
} from '@/store/selectors/class.selector';
import { createEntitySelectorFactory } from '@/store/selectors/root.selectors';
import {
  isLoadingSkillsSelector,
  l2SkillSelector,
  l3SkillSelector,
} from '@/store/selectors/skill.selector';
import { Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = {
  open: boolean;
  onClose: () => void;
  filterState: {
    class_id: string;
    l2_skill: string;
    l3_skill: string;
  };
  setFilterState: (state: {
    l2_skill: string;
    class_id: string;
    l3_skill: string;
  }) => void;
  enableClassFilter: boolean;
};

const QuestionSetReorderQuestionFilterComponent = ({
  open,
  onClose,
  filterState,
  setFilterState,
  enableClassFilter,
}: Props) => {
  const { result: l2Skills, totalCount: l2SkillsCount } =
    useSelector(l2SkillSelector);
  const { result: l3Skills, totalCount: l3SkillsCount } =
    useSelector(l3SkillSelector);
  const { result: classes, totalCount: classesCount } =
    useSelector(classesSelector);

  const isLoadingSkills = useSelector(isLoadingSkillsSelector);
  const isLoadingClasses = useSelector(isLoadingClassesSelector);

  const selectedL2Skill = useSelector(
    createEntitySelectorFactory('skill', filterState.l2_skill)
  );
  const selectedL3Skill = useSelector(
    createEntitySelectorFactory('skill', filterState.l3_skill)
  );
  const selectedClass = useSelector(
    createEntitySelectorFactory('class', filterState.class_id)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[30%] max-h-[95%] overflow-y-auto'>
        <Formik
          initialValues={filterState}
          onSubmit={(values) => {
            setFilterState(values);
            onClose();
          }}
        >
          {(formik) => (
            <form
              onSubmit={formik.handleSubmit}
              className='flex flex-col overflow-x-hidden px-1'
            >
              <h2 className='text-xl font-semibold mb-6'>
                Apply filters - Questions
              </h2>
              {enableClassFilter && (
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
                  isLoading={isLoadingClasses}
                  totalCount={classesCount}
                  preLoadedOptions={[selectedClass]}
                />
              )}
              <FormikInfiniteSelect
                name='l2_skill'
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
              <FormikInfiniteSelect
                name='l3_skill'
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
                preLoadedOptions={[selectedL3Skill]}
              />
              <div className='flex gap-3'>
                <Button type='submit'>Apply</Button>
                <Button
                  type='button'
                  onClick={() => {
                    setFilterState({
                      l2_skill: '',
                      l3_skill: '',
                      class_id: enableClassFilter ? '' : filterState.class_id,
                    });
                    onClose();
                  }}
                  variant='outline'
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSetReorderQuestionFilterComponent;
