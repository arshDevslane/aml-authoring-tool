/* eslint-disable no-case-declarations , @typescript-eslint/naming-convention */
import { CacheAPIResponse } from '@/lib/utils';
import { RepositoryAssociation } from '@/models/entities/RepositoryAssociation';
import produce from 'immer';
import { RepositoryAssociationActionType } from '../actions/actions.constants';
import { RepositoryActionPayloadType } from '../actions/repository.action';

export type RepositoryAssociationState = RepositoryActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, RepositoryAssociation>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
  isDeleting: boolean;
};

const initialState: RepositoryAssociationState = {
  isLoading: false,
  filters: {
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
  isDeleting: false,
};

export const repositoryAssociationReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: RepositoryAssociationState = initialState,
  action: any
) =>
  produce(state, (draft: RepositoryAssociationState) => {
    switch (action.type) {
      case RepositoryAssociationActionType.GET_BY_ID:
        draft.isLoading = true;
        break;

      case RepositoryAssociationActionType.GET_BY_ID_COMPLETED: {
        draft.isLoading = false;
        const { repository_associations } = action.payload;
        const repositoryAssociationsMap = repository_associations?.reduce(
          (acc: any, repositoryAssociation: RepositoryAssociation) => ({
            ...acc,
            [repositoryAssociation.identifier]: repositoryAssociation,
          }),
          {} as Record<string, RepositoryAssociation>
        );

        draft.entities = { ...state.entities, ...repositoryAssociationsMap };

        draft.latestCount = action.payload.totalCount;

        break;
      }

      case RepositoryAssociationActionType.GET_BY_ID_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;

      case RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATION:
      case RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION:
        draft.isDeleting = true;
        break;

      case RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION_COMPLETED:
      case RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATTION_COMPLETED: {
        draft.isDeleting = false;
        draft.cachedData = {};
        const { repositoryAssociation, repositoryId } = action.payload;
        draft.entities[repositoryId] = repositoryAssociation;

        break;
      }

      case RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION_ERROR:
      case RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATTION_ERROR: {
        draft.isDeleting = false;
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      }

      default:
        break;
    }
  });
