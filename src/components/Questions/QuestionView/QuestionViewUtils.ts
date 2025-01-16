/* eslint-disable @typescript-eslint/naming-convention */

import { ArithmaticOperations } from '@/models/enums/ArithmaticOperations.enum';
import { FibType, QuestionType } from '@/models/enums/QuestionType.enum';

export interface QuestionViewPropsType {
  answers: {
    result:
      | {
          quotient: string;
          remainder: string;
        }
      | string;
    isPrefil: boolean;
    answerTop: string;
    answerResult: string;
    answerIntermediate: string;
    answerQuotient: string;
    answerRemainder: string;
    isIntermediatePrefill?: boolean;
    fib_type?: FibType;
  };
  numbers: {
    [key: string]: string;
  };
  questionType: QuestionType;
  questionId: string;
  options?: string[];
  name?: { en: string };
  operation: ArithmaticOperations;
  questionImageUrl?: string;
  correct_option?: string;
}

export const transformQuestion = (apiQuestion: any): any => {
  const {
    question_body,
    identifier,
    question_type,
    description,
    name,
    operation,
  } = apiQuestion;

  // Construct answers only if present
  const answers = question_body?.answers
    ? {
        ...(question_body.answers.result !== undefined && {
          result: question_body.answers.result,
        }),
        ...(question_body.answers.isPrefil !== undefined && {
          isPrefil: question_body.answers.isPrefil,
        }),
        ...(question_body.answers.answerTop !== undefined && {
          answerTop: question_body.answers.answerTop,
        }),
        ...(question_body.answers.answerResult !== undefined && {
          answerResult: question_body.answers.answerResult,
        }),
        ...(question_body.answers?.answerIntermediate !== undefined && {
          answerIntermediate: question_body.answers?.answerIntermediate,
        }),
        ...(question_body.answers?.fib_type !== undefined && {
          fib_type: question_body.answers?.fib_type,
        }),
        ...(question_body.answers?.answerQuotient !== undefined && {
          answerQuotient: question_body.answers?.answerQuotient,
        }),
        ...(question_body.answers?.answerRemainder !== undefined && {
          answerRemainder: question_body.answers?.answerRemainder,
        }),
        ...(question_body.answers?.isIntermediatePrefill !== undefined && {
          isIntermediatePrefill: question_body.answers?.isIntermediatePrefill,
        }),
      }
    : undefined;

  // Construct numbers only if present
  const numbers = question_body?.numbers
    ? {
        ...question_body.numbers, // Spread to keep the dynamic structure (n1, n2, etc.)
      }
    : undefined;

  // Construct options only for MCQ type questions
  const options =
    question_type === QuestionType.MCQ ? question_body?.options : undefined;
  const questionImageUrl = question_body?.question_image_url
    ? question_body.question_image_url
    : undefined;

  const correctOption = question_body?.correct_option?.replace(/Option /, '');
  const correctOptionIndex = Number.isFinite(parseInt(correctOption, 10))
    ? parseInt(correctOption, 10) - 1
    : 0;

  return {
    questionId: identifier, // Assigning identifier as questionId
    questionType: question_type, // Adding questionType from the API
    description, // Adding description from the API
    name,
    operation,
    questionImageUrl,
    ...(answers && { answers }), // Include only if answers exist
    ...(numbers && { numbers }), // Include only if numbers exist
    ...(options && { options, correct_option: options[correctOptionIndex] }), // Include only if it's an MCQ question
  };
};
