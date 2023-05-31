import React, {FormEvent, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {SearchEstate} from "../../../types";
import {Button, Grid, MenuItem, TextField} from "@mui/material";
import {fetchEstates} from "../estatesThunks";
import {LoadingButton} from "@mui/lab";
import {selectEstatesFetching} from "../estatesSlice";

const filterState = <T extends Partial<Record<keyof T, T[keyof T]>>>(
  state: T,
) =>
  Object.entries(state).reduce<Partial<T>>((acc, [key, value]) => {
    if (Boolean(value)) {
      acc[key as keyof T] = value as T[keyof T];
    }
    return acc;
  }, {});

const FilterForm = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<SearchEstate>({});
  const loading = useAppSelector(selectEstatesFetching);
  const estateTypes = ['Квартира', 'Дом', 'Гараж', 'Участок', 'Коммерческое помещение'];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setState(prev => filterState<SearchEstate>(prev));
    if (Object.keys(state).length) {
      dispatch(fetchEstates(state));
    }
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value, numberOfRooms: ''}));
  }

  return (
    <form onSubmit={onSubmit} >
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs>
          <TextField
            id="dealType"
            label="Вид сделки"
            select
            value={state.dealType}
            onChange={onChange}
            name="dealType"
          >
            <MenuItem value="" disabled>
              Пожалуйста, выберите что вы хотите сделать
            </MenuItem>
            <MenuItem value="sale">
              Продать
            </MenuItem>
            <MenuItem value="rent">
              Сдать в аренду
            </MenuItem>
          </TextField>
        </Grid>

        <Grid item xs>
          <TextField
            id="estateType"
            label="Тип жилья"
            select
            value={state.estateType}
            onChange={onTypeChange}
            name="estateType"
          >
            <MenuItem value="" disabled>
              Пожалуйста, выберите тип жилья
            </MenuItem>
            {estateTypes.map(type => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {(state.estateType === 'Квартира' || state.estateType === 'Дом' || state.estateType === 'Коммерческое помещение' || state.estateType === '' || state.estateType === undefined) && <Grid item xs>
          <TextField
            id="numberOfRooms"
            label="Количество комнат"
            value={state.numberOfRooms}
            onChange={onChange}
            name="numberOfRooms"
            type="number" inputProps={{step: 1, min: 1}}
          />
        </Grid>}

        <Grid item>
          <Button color="primary" variant="contained">
            Ещё фильтры
          </Button>
        </Grid>

        <Grid item xs>
          <LoadingButton
            loadingIndicator="Loading…"
            loading={loading}
            disabled={loading}
            type="submit"
            color="success"
            variant="contained"
          >
            Найти
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default FilterForm;