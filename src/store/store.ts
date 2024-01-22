import { configureStore } from "@reduxjs/toolkit";
import { consumerConnectorSlice } from "./slices/consumerConnectorSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { combineReducers } from "@reduxjs/toolkit";

const reducers = combineReducers({
  consumerConnector: consumerConnectorSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
