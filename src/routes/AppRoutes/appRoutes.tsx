import QuestionsPage from '@/views/Questions/QuestionsPage';
import QuestionSetsPage from '@/views/QuestionSetsPage';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import QuestionSetDetailPage from '@/views/login/QuestionSetDetailPage';
import QuestionsAddEditPage from '@/components/Questions/QuestionsAddEditPage';
import ContentListing from '@/components/Content/ContentListing';
import RepositoryListing from '@/components/Repository/RepositoryListing';
import RepositoryAssociatePage from '@/views/RepositoryAssociate/RepositoryAssociatePage';

export enum AppSubRoutes {
  QUESTIONS = 'questions',
  QUESTION_SETS = 'question-sets',
  QUESTION_SET = 'question-sets/:id',
  CONTENT = 'content',
  REPOSITORY = 'repository',
  REPOSITORY_ASSOCIATE = 'repository/:id',
}

export enum CommonSubRoutes {
  ADD = 'add',
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path='/'
      element={<Navigate to={AppSubRoutes.QUESTIONS} replace />}
    />
    <Route path={AppSubRoutes.QUESTIONS} element={<QuestionsPage />} />
    <Route
      path={`${AppSubRoutes.QUESTIONS}/${CommonSubRoutes.ADD}`}
      element={<QuestionsAddEditPage />}
    />
    <Route
      path={`${AppSubRoutes.QUESTIONS}/:id`}
      element={<QuestionsAddEditPage />}
    />
    <Route path={AppSubRoutes.QUESTION_SETS} element={<QuestionSetsPage />} />
    <Route
      path={AppSubRoutes.QUESTION_SET}
      element={<QuestionSetDetailPage />}
    />
    <Route path={AppSubRoutes.CONTENT} element={<ContentListing />} />
    <Route path={AppSubRoutes.REPOSITORY} element={<RepositoryListing />} />
    <Route
      path={AppSubRoutes.REPOSITORY_ASSOCIATE}
      element={<RepositoryAssociatePage />}
    />
  </Routes>
);

export default AppRoutes;
