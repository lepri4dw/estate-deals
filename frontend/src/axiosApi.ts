import axios, {AxiosHeaders, InternalAxiosRequestConfig} from 'axios';
import {apiURL} from "./constants";
import {Store} from "@reduxjs/toolkit";
import {RootState} from "./app/store";

const axiosApi = axios.create({
  baseURL: apiURL,
});

export const addInterceptors = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getState().users.user?.token;
    const headers = config.headers as AxiosHeaders;
    headers.set('Authorization', token);

    return config;
  });
};

export default axiosApi;