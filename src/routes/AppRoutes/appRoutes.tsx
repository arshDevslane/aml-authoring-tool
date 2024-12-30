import QuestionsPage from '@/views/QuestionsPage';
import QuestionSetsPage from '@/views/QuestionSetsPage';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

export enum AppSubRoutes {
  QUESTIONS = 'questions',
  QUESTION_SETS = 'question-sets',
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path='/'
      element={<Navigate to={AppSubRoutes.QUESTIONS} replace />}
    />
    <Route path={AppSubRoutes.QUESTIONS} element={<QuestionsPage />} />
    <Route path={AppSubRoutes.QUESTION_SETS} element={<QuestionSetsPage />} />
  </Routes>
);

export default AppRoutes;
