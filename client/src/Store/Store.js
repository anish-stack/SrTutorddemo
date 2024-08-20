import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginSlice from '../Slices/LoginSlice';
import TeacherSlice from '../Slices/Teacher.slice';
import AdvancedSearchSlice from '../Slices/AdvancedSearch.slice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';
import ClassSlice from '../Slices/Class.slice';
import BlogSlice from '../Slices/Blog.slice';
import TestinomialSlice from '../Slices/Testinomial.slice';
import BannerSlice from '../Slices/BannerSlice';
import SelectedClassSlice from '../Slices/SelectedClass.slice';
import TeacherRequestSlice from '../Slices/TeacherRequest.slice';

// Combine all slice reducers into a single root reducer
const rootReducer = combineReducers({
    login: loginSlice.reducer,
    Teacher: TeacherSlice,
    Advanced: AdvancedSearchSlice,
    Class: ClassSlice,
    Blog: BlogSlice,
    Testimonials: TestinomialSlice,
    Banner: BannerSlice,
    ClassSelected: SelectedClassSlice,
    teacherProfile:TeacherRequestSlice
});

// Create a persist configuration with a whitelist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['login', 'ClassSelected'] 
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer and middleware
export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false,  thunk }),
});

// Create a persistor instance
export const persistor = persistStore(Store);

// // Clear all persisted data after 30 seconds
// setTimeout(() => {
//     persistor.purge();
// }, 1000);
