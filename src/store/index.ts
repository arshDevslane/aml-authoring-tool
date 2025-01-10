import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import ENV_CONFIG from '@/constant/env.config';
import RootReducer from './reducers';
import rootSaga from './sagas';

/* Root Saga Middleware */
const sagaMiddleware = createSagaMiddleware();

/* Root Store with all the combined reducers */
const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: ENV_CONFIG.APP_ENV !== 'production',
});

/* Run the sagas */
sagaMiddleware.run(rootSaga);

export default store;
