import {Estate, EstateMutation, EstateShort, IPagination, PageLimit, SearchEstate, ValidationError} from "../../types";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {isAxiosError} from "axios";

type SearchParam = SearchEstate & PageLimit;

export const fetchEstates = createAsyncThunk<
  IPagination<EstateShort>,
  SearchParam | undefined
  >('estates/fetchAll', async (params) => {
  const { data } = await axiosApi.get<IPagination<EstateShort>>('/estates', {
    params,
  });
  return data;
});

export const fetchOneEstate = createAsyncThunk<Estate, string>(
  'estates/fetchOne',
  async (id) => {
    const response = await axiosApi.get('/estates/' + id);
    return response.data;
  },
);

export const createEstate = createAsyncThunk<
  void,
  EstateMutation,
  { rejectValue: ValidationError }
  >('estates/create', async (estateMutation, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(estateMutation) as (keyof EstateMutation)[];
    keys.forEach((key) => {
      const value = estateMutation[key];
      if (value !== null) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image) => {
            formData.append('images', image);
          });
        } else if (!Array.isArray(value)) {
          formData.append(key, value);
        }
      }
    });
    await axiosApi.post('/estates', formData);
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

interface UpdateEstateParams {
  id: string;
  estate: EstateMutation;
}

export const updateEstate = createAsyncThunk<
  void,
  UpdateEstateParams,
  { rejectValue: ValidationError }
  >('estates/update', async ({id, estate}, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(estate) as (keyof EstateMutation)[];
    keys.forEach((key) => {
      const value = estate[key];
      if (value !== null) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image) => {
            formData.append('images', image);
          });
        } else if (!Array.isArray(value)) {
          formData.append(key, value);
        }
      }
    });
    await axiosApi.put(`/estates/${id}`, formData);
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const deleteEstate = createAsyncThunk<void, string>(
  'estates/delete', async (id) => {
    await axiosApi.delete('/estates/' + id);
});

export const estateTogglePublished = createAsyncThunk<void, string>(
  'estate/toggleIsPublished',
  async (id) => {
    await axiosApi.patch(`/estates/${id}/togglePublished`);
  }
)
