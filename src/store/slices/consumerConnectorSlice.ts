import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConsumerConnectorState {
  schema: string;
  host: string;
  port: string;
  origin: string;
};

const initialState: ConsumerConnectorState = {
  schema: "https",
  host: "172.26.16.20",
  port: "443",
  origin: "https://172.26.16.20:443",
};

export const consumerConnectorSlice = createSlice({
  name: "consumerConnector",
  initialState,
  reducers: {
    setSchema: (state, action: PayloadAction<string>) => {
      state.schema = action.payload;
      state.origin = state.schema + "://" + state.host + ":" + state.port;
    },
    setHost: (state, action: PayloadAction<string>) => {
      state.host = action.payload;
      state.origin = state.schema + "://" + state.host + ":" + state.port;
    },
    setPort: (state, action: PayloadAction<string>) => {
      state.port = action.payload;
      state.origin = state.schema + "://" + state.host + ":" + state.port;
    },
  },
});