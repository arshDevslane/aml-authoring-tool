import { cn, QuestionOrderType } from '@/lib/utils';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
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
import { Trash } from 'lucide-react';
import React, { CSSProperties } from 'react';

type QuestionSetQuestionsReorderComponentProps = {
  questionsOrder: QuestionOrderType[];
  setQuestionsOrder: React.Dispatch<React.SetStateAction<QuestionOrderType[]>>;
};

const DraggableItem = ({
  question,
  onRemove,
  index,
}: {
  question: QuestionOrderType;
  onRemove: (id: string) => void;
  index: number;
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
      label: 'Class',
      value: question?.taxonomy?.class?.name?.en,
      hasValue: Boolean(question?.taxonomy?.class?.name?.en),
    },
    {
      label: 'Question Type',
      value: question?.question_type,
      hasValue: Boolean(question?.question_type),
    },
    {
      label: 'L2 Skills',
      value: question?.taxonomy?.l2_skill?.length
        ? question.taxonomy.l2_skill?.map((l2) => l2.name.en).join(', ')
        : '--',
      hasValue: Boolean(question?.taxonomy?.l2_skill?.length),
    },
    {
      label: 'L3 Skills',
      value: question?.taxonomy?.l3_skill?.length
        ? question.taxonomy.l3_skill.map((l3) => l3.name.en).join(', ')
        : '--',
      hasValue: Boolean(question?.taxonomy?.l3_skill?.length),
    },
    {
      label: 'N1',
      value: question?.question_body?.numbers?.n1,
      hasValue: Boolean(question?.question_body?.numbers?.n1),
    },
    {
      label: 'N2',
      value: question?.question_body?.numbers?.n2,
      hasValue: Boolean(question?.question_body?.numbers?.n2),
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
      hide: true,
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
      <div>
        <div className='flex gap-2 items-end mb-2'>
          <p className='font-bold text-2xl'>{index + 1}.</p>
          <h1 className='text-xl font-bold'>{question?.description?.en}</h1>
        </div>
        <div className='grid grid-cols-3 gap-x-8 gap-y-2'>
          {dataObject.map((item) => (
            <div
              key={item.label}
              className={cn('flex gap-1', item.hide && 'hidden')}
            >
              <h1 className='text-sm font-bold'>{item.label}:</h1>
              <p className='text-sm'>{item.hasValue ? item.value : '--'}</p>
            </div>
          ))}
        </div>
      </div>
      <AmlTooltip tooltip='Remove'>
        <Trash
          className='h-6 w-6 fill-red-500 hover:text-red-600 text-red-500 cursor-pointer'
          onClick={() => onRemove(question?.identifier)}
        />
      </AmlTooltip>
    </div>
  );
};

const QuestionSetQuestionReorderComponent = ({
  questionsOrder = [],
  setQuestionsOrder,
}: QuestionSetQuestionsReorderComponentProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <h1 className='text-2xl font-bold mb-5'>Questions</h1>
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
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default QuestionSetQuestionReorderComponent;
