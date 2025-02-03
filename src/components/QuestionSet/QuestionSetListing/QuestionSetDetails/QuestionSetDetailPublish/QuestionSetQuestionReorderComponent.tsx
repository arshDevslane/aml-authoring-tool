import QuestionsAddEditPage from '@/components/Questions/QuestionsAddEditPage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { QuestionSetPurposeType } from '@/enums/questionSet.enum';
import { cn, QuestionOrderType } from '@/lib/utils';
import { QuestionSet } from '@/models/entities/QuestionSet';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
import { InfiniteSelect } from '@/shared-resources/InfiniteSelect/InfiniteSelect';
import { getListQuestionsAction } from '@/store/actions/question.action';
import {
  isLoadingQuestionsSelector,
  noCacheQuestionSelector,
} from '@/store/selectors/questions.selector';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, Filter, Pencil, Trash } from 'lucide-react';
import React, { CSSProperties, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import QuestionSetReorderQuestionFilterComponent from '../QuestionSetReorderQuestionFilterComponent';

type QuestionSetQuestionsReorderComponentProps = {
  questionsOrder: QuestionOrderType[];
  questionSet: QuestionSet;
  setQuestionsOrder: React.Dispatch<React.SetStateAction<QuestionOrderType[]>>;
};

enum DialogTypes {
  FILTER = 'filter',
  CONTENT = 'content',
  DETAILS = 'details',
}

const DraggableItem = ({
  question,
  onRemove,
  index,
  onEdit,
}: {
  question: QuestionOrderType;
  onRemove: (id: string) => void;
  index: number;
  onEdit: (id: string, isViewMode?: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: question.identifier,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };
  const dataObject = [
    {
      label: 'Question Type',
      value: question?.question_type,
      hasValue: Boolean(question?.question_type),
    },
    {
      label: 'N1',
      value: question?.question_body?.numbers?.n1,
      hasValue: Boolean(question?.question_body?.numbers?.n1),
      hide: Boolean(!question?.question_body?.numbers?.n1),
    },
    {
      label: 'N2',
      value: question?.question_body?.numbers?.n2,
      hasValue: Boolean(question?.question_body?.numbers?.n2),
      hide: Boolean(!question?.question_body?.numbers?.n2),
    },
    {
      label: 'Image',
      value: question?.question_body?.question_image_url,
      hasValue: Boolean(question?.question_body?.question_image_url),
      hide: true,
    },
    {
      label: 'Options',
      value: question?.question_body?.options?.join(', '),
      hasValue: Boolean(question?.question_body?.options?.length),
      hide: Boolean(!question?.question_body?.options?.length),
    },
  ];

  return (
    <div
      key={question?.identifier}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        'flex items-center justify-between gap-2 p-2 border-2 rounded-md bg-white my-1',
        isDragging && 'bg-red-100',
        isOver && !isDragging && 'bg-yellow-100 border-yellow-200'
      )}
    >
      <div className='w-full'>
        <div className='flex justify-between w-full'>
          <span className='flex gap-2 mb-2 items-center'>
            <p className='font-bold text-2xl'>{index + 1}.</p>
            <h1 className='text-xl font-bold'>{question?.description?.en}</h1>
            <span className='font-normal'>{`(${question.x_id})`}</span>
          </span>
          <span className='flex gap-2'>
            <AmlTooltip tooltip='View'>
              <Eye
                className='hover:fill-slate-400 cursor-pointer'
                onClick={() => onEdit(question?.identifier, true)}
                size='18px'
              />
            </AmlTooltip>
            <AmlTooltip tooltip='Edit'>
              <Pencil
                className='hover:fill-slate-400 cursor-pointer'
                onClick={() => onEdit(question?.identifier)}
                size='18px'
              />
            </AmlTooltip>
            <AmlTooltip tooltip='Remove'>
              <Trash
                className='fill-red-500 hover:text-red-600 text-red-500 cursor-pointer'
                onClick={() => onRemove(question?.identifier)}
                size='18px'
              />
            </AmlTooltip>
          </span>
        </div>

        <div className='grid grid-cols-3 gap-x-8 gap-y-2'>
          {dataObject.map((item) => (
            <div
              key={item.label}
              className={cn('flex gap-1', item.hide && 'hidden')}
            >
              <h1 className='text-sm font-bold'>{item.label}:</h1>
              {item.label === 'Options' ? (
                <AmlTooltip tooltip={item.hasValue ? item.value : ''}>
                  <p className={cn('text-sm truncate max-w-20')}>
                    {item.hasValue ? item.value : '--'}
                  </p>
                </AmlTooltip>
              ) : (
                <p className='text-sm'>{item.hasValue ? item.value : '--'}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuestionSetQuestionReorderComponent = ({
  questionsOrder = [],
  questionSet,
  setQuestionsOrder,
}: QuestionSetQuestionsReorderComponentProps) => {
  const [mountCounter, setMountCounter] = useState(0);
  const [openDialog, setOpenDialog] = useState<{
    open: boolean;
    dialog: DialogTypes | null;
  }>({
    open: false,
    dialog: null,
  });
  const [openQuestionDialog, setOpenQuestionDialog] = useState<{
    dialog: DialogTypes | null;
    open: boolean;
    questionId?: string;
    isViewMode?: boolean;
  }>({
    dialog: null,
    open: false,
  });

  const [filterState, setFilterState] = useState<{
    l2_skill: string;
    l3_skill: string;
    class_id: string;
  }>({
    l2_skill: '',
    l3_skill: '',
    class_id: '',
  });

  const { result, totalCount } = useSelector(noCacheQuestionSelector);
  const isLoadingQuestions = useSelector(isLoadingQuestionsSelector);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const enableClassFilter =
    questionSet?.purpose === QuestionSetPurposeType.MAIN_DIAGNOSTIC;

  const filterCount = useMemo(() => {
    const state = {
      ...(enableClassFilter && { class_id: filterState.class_id }),
      l2_skill: filterState.l2_skill,
      l3_skill: filterState.l3_skill,
    };

    return Object.values(state).filter(Boolean).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState]);

  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    if (event.active.id !== event.over.id) {
      const oldIndex = event.active.data.current?.sortable?.index;
      const newIndex = event.over.data.current?.sortable?.index;

      setQuestionsOrder(arrayMove(questionsOrder, oldIndex, newIndex));
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestionsOrder((prevOrder) =>
      prevOrder.filter((ques) => ques.identifier !== id)
    );
    setMountCounter((prev) => prev + 1);
  };
  const handleOnEdit = (id: string, isViewMode?: boolean) => {
    setOpenQuestionDialog({
      dialog: DialogTypes.DETAILS,
      open: true,
      questionId: id,
      isViewMode,
    });
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <div className='flex justify-between mt-3 mb-5 gap-5'>
          <h1 className='text-2xl font-bold'>Questions</h1>
          <div className='flex flex-1 overflow-hidden flex-col gap-1 w-[300px]'>
            <InfiniteSelect
              key={mountCounter}
              isLoading={isLoadingQuestions}
              onChange={setQuestionsOrder}
              data={result}
              totalCount={totalCount}
              dispatchAction={(values) =>
                getListQuestionsAction({
                  filters: {
                    search_query: values.value,
                    l1_skill_id: questionSet.taxonomy.l1_skill.identifier,
                    repository_id: questionSet.repository.identifier,
                    board_id: questionSet.taxonomy.board.identifier,
                    class_id: enableClassFilter
                      ? filterState.class_id
                      : questionSet.taxonomy.class.identifier,

                    page_no: values.page_no,

                    l2_skill_id: filterState.l2_skill,
                    l3_skill_id: filterState.l3_skill,
                  },
                  noCache: true,
                })
              }
              valueKey='identifier'
              labelKey='x_id'
              preLoadedOptions={questionsOrder}
              multiple
              isClearable={false}
            />
          </div>
          <div className='flex items-center gap-5'>
            <Button
              className='relative'
              onClick={() =>
                setOpenDialog({ open: true, dialog: DialogTypes.FILTER })
              }
            >
              <Filter className={cn('text-white')} />
              Filters
              {filterCount > 0 && (
                <div className='absolute -top-2 -right-2 bg-gray-500 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs'>
                  {filterCount}
                </div>
              )}
            </Button>
          </div>
        </div>
        <div className='flex-1 flex flex-col overflow-y-auto pr-3'>
          {questionsOrder.length === 0 && (
            <div className='text-lg font-bold h-full flex items-center justify-center'>
              No questions added yet.
            </div>
          )}
          <SortableContext
            items={questionsOrder.map((row) => row.identifier)}
            strategy={verticalListSortingStrategy}
          >
            {questionsOrder.map((question, index) => (
              <DraggableItem
                index={index}
                key={question.identifier}
                question={question}
                onRemove={handleRemoveQuestion}
                onEdit={handleOnEdit}
              />
            ))}
          </SortableContext>
        </div>
        <QuestionSetReorderQuestionFilterComponent
          open={openDialog.open && openDialog.dialog === DialogTypes.FILTER}
          onClose={() => setOpenDialog({ open: false, dialog: null })}
          filterState={filterState}
          setFilterState={setFilterState}
          enableClassFilter={enableClassFilter}
        />
      </DndContext>
      <Dialog
        open={
          openQuestionDialog.open &&
          openQuestionDialog.dialog === DialogTypes.DETAILS
        }
        onOpenChange={() =>
          setOpenQuestionDialog({
            dialog: null,
            open: false,
            questionId: undefined,
            isViewMode: undefined,
          })
        }
      >
        <DialogContent className='max-w-[80%] max-h-[95%] overflow-y-auto'>
          <QuestionsAddEditPage
            questionId={openQuestionDialog.questionId}
            viewMode={openQuestionDialog?.isViewMode}
            onClose={() =>
              setOpenQuestionDialog({
                dialog: null,
                open: false,
                questionId: undefined,
                isViewMode: undefined,
              })
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionSetQuestionReorderComponent;
