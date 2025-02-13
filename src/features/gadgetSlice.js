import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API endpoints
const BASE_URL = "https://playground-016-backend.vercel.app/api";

// API CALLS USING REDUX THUNKS

/**
 * Fetch all gadgets from the API
 */
export const fetchAllGadgets = createAsyncThunk(
  "gadgets/fetchGadgets",
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-gadgets`);
      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  }
);

/**
 * Fetch a single gadget by its ID
 */
export const fetchGadgetById = createAsyncThunk(
  "gadgets/fetchGadgetById",
  async (gadgetId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-gadget/${gadgetId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch By ID Error:", error);
      throw error;
    }
  }
);

/**
 * Create a new gadget
 */
export const postGadget = createAsyncThunk(
  "gadgets/postGadget",
  async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/post-gadget`, formData);
      return response.data;
    } catch (error) {
      console.error("Post Error:", error);
      throw error;
    }
  }
);

/**
 * Update an existing gadget
 */
export const updateGadget = createAsyncThunk(
  "gadgets/updateGadget",
  async ({ gadgetId, formData }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/put-gadget/${gadgetId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Update Error:", error);
      throw error;
    }
  }
);

/**
 * Delete an existing gadget
 */
export const deleteGadget = createAsyncThunk(
  "gadgets/deleteGadget",
  async (gadgetId) => {
    try {
      await axios.delete(`${BASE_URL}/delete-gadget/${gadgetId}`);
      return { gadgetId }; // Return ID for state update
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  }
);
 

// Create the gadget slice
export const gadgetSlice = createSlice({
  name: "gadgets",
  initialState: {
    gadgets: [], // Fixed typo from 'gadegts'
    singleGadget: null,
    fetchStatus: "idle",
    fetchByIdStatus: "idle",
    addStatus: "idle",
    deleteStatus: "idle",
    updateStatus: "idle",
    searchFilter: "",
    error: null,
  },
  reducers: {
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all gadgets
      .addCase(fetchAllGadgets.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchAllGadgets.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.gadgets = action.payload;
        state.error = null;
      })
      .addCase(fetchAllGadgets.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.error = action.error.message;
      })

      // Fetch single gadget
      .addCase(fetchGadgetById.pending, (state) => {
        state.fetchByIdStatus = "loading";
      })
      .addCase(fetchGadgetById.fulfilled, (state, action) => {
        state.fetchByIdStatus = "success";
        state.singleGadget = action.payload;
        state.error = null;
      })
      .addCase(fetchGadgetById.rejected, (state, action) => {
        state.fetchByIdStatus = "error";
        state.error = action.error.message;
      })

      // Post new gadget
      .addCase(postGadget.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(postGadget.fulfilled, (state, action) => {
        state.addStatus = "success";
        state.gadgets.push(action.payload);
        state.error = null;
      })
      .addCase(postGadget.rejected, (state, action) => {
        state.addStatus = "error";
        state.error = action.error.message;
      })

      // Delete gadget
      .addCase(deleteGadget.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteGadget.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        state.gadgets = state.gadgets.filter(
          (gadget) => gadget._id !== action.payload.gadgetId
        );
        state.error = null;
      })
      .addCase(deleteGadget.rejected, (state, action) => {
        state.deleteStatus = "error";
        state.error = action.error.message;
      })

      // Update gadget
      .addCase(updateGadget.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateGadget.fulfilled, (state, action) => {
        state.updateStatus = "success";
        const updatedGadget = action.payload;
        const index = state.gadgets.findIndex(
          (gadget) => gadget._id === updatedGadget._id
        );
        if (index !== -1) {
          state.gadgets[index] = updatedGadget;
        }
        state.error = null;
      })
      .addCase(updateGadget.rejected, (state, action) => {
        state.updateStatus = "error";
        state.error = action.error.message;
      });
  },
});

export const getAllGadgets = (state) => state.gadgets.gadgets;
export const getGadgetById = (state) => state.gadgets.singleGadget;

export const getAllGadgetStatuses = createSelector(
  (state) => state.gadgets.fetchStatus,
  (state) => state.gadgets.addStatus,
  (state) => state.gadgets.deleteStatus,
  (state) => state.gadgets.updateStatus,
  (state) => state.gadgets.fetchByIdStatus,

  (fetchStatus, addStatus, deleteStatus, updateStatus, fetchByIdStatus) => ({
    fetchStatus,
    addStatus,
    deleteStatus,
    updateStatus,
    fetchByIdStatus,
  })
);

export const selectFilteredGadgets = createSelector(
  [getAllGadgets, (state) => state.gadgets.searchFilter],
  (gadgets, searchFilter) => {
    if (!searchFilter) return gadgets;

    return gadgets.filter(
      (gadget) =>
        gadget.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        gadget.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
        gadget.description.toLowerCase().includes(searchFilter.toLowerCase())

    );
  }
);

// Export actions
export const { setSearchFilter } = gadgetSlice.actions;

// Export reducer
export default gadgetSlice.reducer;
