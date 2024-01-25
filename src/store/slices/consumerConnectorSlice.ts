import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConsumerConnectorState {
  origin: string;
};

const initialState: ConsumerConnectorState = {
  origin: "https://172.26.16.20:443/",
};

export const consumerConnectorSlice = createSlice({
  name: "consumerConnector",
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<string>) => {
      state.origin = action.payload;
    }
  },
});