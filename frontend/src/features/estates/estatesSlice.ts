import {Estate, EstateShort, ValidationError} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {
  createEstate,
  deleteEstate,
  estateTogglePublished,
  fetchEstates,
  fetchOneEstate,
  updateEstate
} from "./estatesThunks";

interface EstateState {
  items: EstateShort[];
  fetchLoading: boolean;
  oneEstate: Estate | null;
  fetchOneLoading: boolean;
  submitting: boolean;
  error: ValidationError | null;
  deleteLoading: string | false;
  togglingIsPublished: boolean;
  currentPage: number;
  totalCount: number;
}

const initialState: EstateState = {
  items: [],
  fetchLoading: false,
  oneEstate: null,
  fetchOneLoading: false,
  submitting: false,
  error: null,
  deleteLoading: false,
  togglingIsPublished: false,
  currentPage: 1,
  totalCount: 1,
};

const estatesSlice = createSlice({
  name: 'estates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstates.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchEstates.fulfilled, (state, {payload: result}) => {
        state.fetchLoading = false;
        state.items = result.estates;
        state.currentPage = result.currentPage;
        state.totalCount = result.totalCount;
      })
      .addCase(fetchEstates.rejected, (state) => {
        state.fetchLoading = false;
      })

      .addCase(fetchOneEstate.pending, (state) => {
        state.fetchOneLoading = true;
      })
      .addCase(fetchOneEstate.fulfilled, (state, {payload: estate}) => {
        state.fetchOneLoading = false;
        state.oneEstate = estate;
      })
      .addCase(fetchOneEstate.rejected, (state) => {
        state.fetchOneLoading = false;
      })

      .addCase(createEstate.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createEstate.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createEstate.rejected, (state, {payload: error}) => {
        state.submitting = false;
        state.error = error ||  null;
      })

      .addCase(updateEstate.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateEstate.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateEstate.rejected, (state, {payload: error}) => {
        state.submitting = false;
        state.error = error || null;
      })

      .addCase(deleteEstate.pending, (state, { meta: { arg: id }} ) => {
        state.deleteLoading = id;
      })
      .addCase(deleteEstate.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteEstate.rejected, (state) => {
        state.deleteLoading = false;
      })

      .addCase(estateTogglePublished.pending, (state) => {
        state.togglingIsPublished = true;
      })
      .addCase(estateTogglePublished.fulfilled, (state) => {
        state.togglingIsPublished = false;
      })
      .addCase(estateTogglePublished.rejected, (state) => {
        state.togglingIsPublished = false;
      });
  }
});

export const estatesReducer = estatesSlice.reducer;
export const selectEstates = (state: RootState) => state.estates.items;
export const selectEstatesFetching = (state: RootState) =>
  state.estates.fetchLoading;
export const selectOneEstate = (state: RootState) => state.estates.oneEstate;
export const selectOneEstateFetching = (state: RootState) =>
  state.estates.fetchOneLoading;
export const selectEstateSubmitting = (state: RootState) =>
  state.estates.submitting;
export const selectEstateError = (state: RootState) => state.estates.error;
export const selectEstateDeleting = (state: RootState) =>
  state.estates.deleteLoading;
export const selectEstatePage = (state: RootState) => state.estates.currentPage;
export const selectEstatesCount = (state: RootState) =>
  state.estates.totalCount;
export const selectEstateTogglingPublished = (state: RootState) =>
  state.estates.togglingIsPublished;
