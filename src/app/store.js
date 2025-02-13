import { configureStore } from "@reduxjs/toolkit";
import { gadgetSlice } from "../features/gadgetSlice";

export const store = configureStore({
    reducer: {
        gadgets: gadgetSlice.reducer
    }
})