/* eslint-disable @typescript-eslint/no-unused-vars */

import ENV_CONFIG from '@/constant/env.config';
import { Description } from '@/models/entities/Question';
import { ArithmaticOperations } from '@/models/enums/ArithmaticOperations.enum';
import { FibType, QuestionType } from '@/models/enums/QuestionType.enum';
import { SupportedLanguages } from '@/models/enums/SupportedLanguages.enum';

const BASE_URL = ENV_CONFIG.BACKEND_URL as string;
export function convertToDate(isoString: string) {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0]; // Extract the date part in YYYY-MM-DD format
}

export function getCommaSeparatedNumbers(numbersObject: object) {
  // Check if any of the values in the numbers object are null
  const numberArray = Object.values(numbersObject || {}).map((value) =>
    value === null ? '-' : value
  );

  return numberArray.length === 0 || numberArray.every((val) => val === '-')
    ? '-'
    : numberArray.join(', ');
}

export function toReadableFormat(input: string, splitBy = '-'): string {
  // Replace dashes with spaces and capitalize the first letter of each word
  if (!input) return '-';

  return input
    .split(splitBy) // Split the string by dash
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
    .join(' '); // Join the words with a space
}

export function enumToSelectOptions<T extends object>(
  enumObj: T
): {
  label: string;
  value: string;
}[] {
  return Object.entries(enumObj).map(([_, value]) => ({
    label: value as string, // Enum value as label
    value, // Enum key as value
  }));
}

export function enumToKeySelectOptions<T extends object>(
  enumObj: T
): {
  label: string;
  value: string;
}[] {
  return Object.entries(enumObj).map(([key, value]) => ({
    label: value as string, // Enum value as label
    value: key, // Enum key as value
  }));
}

const convertToNumbers = (obj: any) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, Number(value)])
  );

export const cleanQuestionBody = (
  questionBody: any,
  operation: string,
  questionType: string
) => {
  // Create a copy of the questionBody to modify
  let cleanedQuestionBody = { ...questionBody };

  // Check for question type and operation to filter out unnecessary fields
  if (questionType === QuestionType.GRID_2) {
    cleanedQuestionBody = {
      numbers: convertToNumbers(cleanedQuestionBody.numbers),
    };
  } else if (questionType === QuestionType.MCQ) {
    if (!Object.keys(questionBody?.question_image).length) {
      cleanedQuestionBody = {
        options: cleanedQuestionBody.options,
        correct_option: cleanedQuestionBody.correct_option,
      };
    } else {
      cleanedQuestionBody = {
        options: cleanedQuestionBody.options,
        correct_option: cleanedQuestionBody.correct_option,
        question_image: cleanedQuestionBody.question_image,
      };
    }
  } else if (
    questionType === QuestionType.FIB &&
    (questionBody?.fib_type === FibType.FIB_STANDARD ||
      questionBody.fib_type === FibType.FIB_QUOTIENT_REMAINDER)
  ) {
    cleanedQuestionBody = {
      fib_type: cleanedQuestionBody.fib_type,
      numbers: convertToNumbers(cleanedQuestionBody.numbers),
    };
  } else if (
    questionType === QuestionType.FIB &&
    questionBody?.fib_type === FibType.FIB_STANDARD_WITH_IMAGE
  ) {
    cleanedQuestionBody = {
      fib_type: cleanedQuestionBody.fib_type,
      fib_answer: cleanedQuestionBody.fib_answer,
      question_image: cleanedQuestionBody.question_image,
    };
  } else if (
    operation === ArithmaticOperations.ADDITION &&
    questionType === QuestionType.GRID_1
  ) {
    // Only keep relevant fields for Addition Grid_1 questions
    cleanedQuestionBody = {
      numbers: convertToNumbers(cleanedQuestionBody.numbers),
      grid1_show_carry: cleanedQuestionBody.grid1_show_carry,
      grid1_pre_fills_top: cleanedQuestionBody.grid1_pre_fills_top,
      grid1_pre_fills_result: cleanedQuestionBody.grid1_pre_fills_result,
    };
  } else if (
    operation === ArithmaticOperations.SUBTRACTION &&
    questionType === QuestionType.GRID_1
  ) {
    // Only keep relevant fields for Subtraction Grid_1 questions
    cleanedQuestionBody = {
      numbers: convertToNumbers(cleanedQuestionBody.numbers),
      grid1_show_regroup: cleanedQuestionBody.grid1_show_regroup,
      grid1_pre_fills_top: cleanedQuestionBody.grid1_pre_fills_top,
      grid1_pre_fills_result: cleanedQuestionBody.grid1_pre_fills_result,
    };
  } else if (
    operation === ArithmaticOperations.MULTIPLICATION &&
    questionType === QuestionType.GRID_1
  ) {
    // Only keep relevant fields for Multiplication Grid_1 questions
    cleanedQuestionBody = {
      numbers: convertToNumbers(cleanedQuestionBody.numbers),
      grid1_multiply_intermediate_steps_prefills:
        cleanedQuestionBody.grid1_multiply_intermediate_steps_prefills,
      grid1_pre_fills_result: cleanedQuestionBody.grid1_pre_fills_result,
    };
  } else if (
    operation === ArithmaticOperations.DIVISION &&
    questionType === QuestionType.GRID_1
  ) {
    // Only keep relevant fields for Multiplication Grid_1 questions
    cleanedQuestionBody = {
      numbers: convertToNumbers(cleanedQuestionBody.numbers),
      grid1_pre_fills_quotient: cleanedQuestionBody.grid1_pre_fills_quotient,
      grid1_pre_fills_remainder: cleanedQuestionBody.grid1_pre_fills_remainder,
      grid1_div_intermediate_steps_prefills:
        cleanedQuestionBody.grid1_div_intermediate_steps_prefills,
    };
  }

  return cleanedQuestionBody;
};

export const getMultiLangFormikInitialValues = (data?: Description) => {
  const res = {} as Description;
  Object.values(SupportedLanguages).forEach((lang) => {
    res[lang] = data?.[lang] ?? '';
  });
  return res;
};

export const removeNullOrUndefinedValues = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null));

export const clearQueryParams = (
  obj: Record<string, any>,
  keys: string[] = ['sortOrder', 'orderBy']
) =>
  Object.entries(obj).filter(([key, value]) => {
    if (keys.includes(key)) {
      return value != null;
    }
    return true;
  });

type Media = {
  url: string;
  storage: 'local' | 's3';
};
export const getMediaUrl = (url: string): string =>
  url?.startsWith('/uploads') ? `${BASE_URL}${url}` : url;
