import React, {useState} from 'react';
import {EstateMutation} from "../../../types";
import {useAppSelector} from "../../../app/hooks";
import {selectEstateError, selectEstateSubmitting} from "../estatesSlice";
import {Grid, MenuItem, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import FileInput from "../../../components/UI/FileInput/FileInput";

interface Props {
  onSubmit: (estateMutation: EstateMutation) => void;
  existingEstate?: EstateMutation;
  isEdit?: boolean;
}

const initialState: EstateMutation = {
  usdPrice: '',
  kgsPrice: '',
  floor: '',
  numberOfFloors: '',
  numberOfRooms: '',
  square: '',
  condition: '',
  town: '',
  images: null,
  description: '',
  dealType: '',
  landArea: '',
  address: '',
  estateType: '',
}

const EstateForm: React.FC<Props> = ({onSubmit, existingEstate = initialState, isEdit = false}) => {
  const error = useAppSelector(selectEstateError);
  const loading = useAppSelector(selectEstateSubmitting);
  const [state, setState] = useState<EstateMutation>(existingEstate);
  const [currency, setCurrency] = useState('USD');
  const estateTypes = ['Квартира', 'Дом', 'Гараж', 'Участок', 'Коммерческое помещение'];
  const conditions = ['под самоотделку', 'хорошее', 'среднее', 'не достроено'];

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const onCurrencyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrency(e.target.value);
    setState(prev => ({
      ...prev, usdPrice: '', kgsPrice: '',
    }))
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value, numberOfFloors: '', floor: '', numberOfRooms: '', square: '', condition: '', landArea: ''}));
  }

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: files ? Array.from(files) : null,
    }));
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(state);
    setState(initialState);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <TextField
            id="dealType"
            label="Вид сделки"
            select
            value={state.dealType}
            onChange={onChange}
            name="dealType"
            required
            error={Boolean(getFieldError('dealType'))}
            helperText={getFieldError('dealType')}
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
            required
            error={Boolean(getFieldError('estateType'))}
            helperText={getFieldError('estateType')}
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

        <Grid item xs>
          <TextField
            id="town"
            label="Населенный пункт"
            value={state.town}
            onChange={onChange}
            name="town"
            required
            error={Boolean(getFieldError('town'))}
            helperText={getFieldError('town')}
          />
        </Grid>

        <Grid item xs container spacing={1}>
          <Grid item xs={10}>
            <TextField
              id="price"
              label="Цена"
              value={currency === 'USD' ? state.usdPrice : state.kgsPrice}
              onChange={onChange}
              name={currency === 'USD' ? 'usdPrice' : 'kgsPrice'}
              required
              error={Boolean(getFieldError(currency === 'USD' ? 'usdPrice' : 'kgsPrice'))}
              helperText={getFieldError(currency === 'USD' ? 'usdPrice' : 'kgsPrice')}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="currency"
              label="Валюта"
              select
              value={currency}
              onChange={onCurrencyChange}
              name="currency"
              required
              error={Boolean(getFieldError('currency'))}
              helperText={getFieldError('currency')}
            >
              <MenuItem value="USD">
                $
              </MenuItem>'
              <MenuItem value="KGS">
                Сом
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid item xs>
          <TextField
            id="address"
            label="Адрес"
            value={state.address}
            onChange={onChange}
            name="address"
            required
            error={Boolean(getFieldError('address'))}
            helperText={getFieldError('address')}
          />
        </Grid>

        {(state.estateType === 'Квартира' || state.estateType === 'Коммерческое помещение' || state.estateType === '') && <Grid item xs>
          <TextField
            id="floor"
            label="Этаж"
            value={state.floor}
            onChange={onChange}
            name="floor"
            required type="number" inputProps={{step: 1, min: -1}}
            error={Boolean(getFieldError('floor'))}
            helperText={getFieldError('floor')}
          />
        </Grid>}

        {(state.estateType === 'Квартира' || state.estateType === 'Дом' || state.estateType === 'Коммерческое помещение' || state.estateType === '') && <Grid item xs>
          <TextField
            id="numberOfFloors"
            label="Всего этажей"
            value={state.numberOfFloors}
            onChange={onChange}
            name="numberOfFloors"
            required type="number" inputProps={{step: 1, min: state.floor ? parseInt(state.floor) : 1}}
            error={Boolean(getFieldError('numberOfFloors'))}
            helperText={getFieldError('numberOfFloors')}
          />
        </Grid>}

        {(state.estateType === 'Квартира' || state.estateType === 'Дом' || state.estateType === 'Коммерческое помещение' || state.estateType === '') && <Grid item xs>
          <TextField
            id="numberOfRooms"
            label="Количество комнат"
            value={state.numberOfRooms}
            onChange={onChange}
            name="numberOfRooms"
            required type="number" inputProps={{step: 1, min: 1}}
            error={Boolean(getFieldError('numberOfRooms'))}
            helperText={getFieldError('numberOfRooms')}
          />
        </Grid>}

        {state.estateType !== 'Участок' && <Grid item xs>
          <TextField
            id="square"
            label={`Площадь м${'\u00B2'}`}
            value={state.square}
            onChange={onChange}
            name="square"
            required type="number" inputProps={{min: 1}}
            error={Boolean(getFieldError('square'))}
            helperText={getFieldError('square')}
          />
        </Grid>}

        {state.estateType !== 'Участок' && <Grid item xs>
          <TextField
            id="condition"
            label="Состояние"
            select
            value={state.condition}
            onChange={onChange}
            name="condition"
            required
            error={Boolean(getFieldError('condition'))}
            helperText={getFieldError('condition')}
          >
            <MenuItem value="" disabled>
              Пожалуйста, выберите состояние
            </MenuItem>
            {conditions.map(condition => (
              <MenuItem value={condition} key={condition}>
                {condition}
              </MenuItem>
            ))}
          </TextField>
        </Grid>}

        <Grid item xs>
          <TextField
            id="description"
            label="Описание"
            value={state.description}
            onChange={onChange}
            name="description" multiline rows={3}
            required type="number" inputProps={{min: 1}}
            error={Boolean(getFieldError('description'))}
            helperText={getFieldError('description')}
          />
        </Grid>

        {(state.estateType === 'Дом' || state.estateType === 'Участок') && <Grid item xs>
          <TextField
            id="landArea"
            label="Площадь участка (в сотках)"
            value={state.landArea}
            onChange={onChange}
            name="landArea"
            required={state.estateType === 'Участок'} type="number" inputProps={{min: 0}}
            error={Boolean(getFieldError('landArea'))}
            helperText={getFieldError('landArea')}
          />
        </Grid>}

        <Grid item xs>
          <FileInput
            label="Выберите фотографии"
            onChange={onFilesChange}
            name="images"
            error={Boolean(getFieldError('images'))}
            helperText={getFieldError('images')}
          />
        </Grid>

        <Grid item xs>
          <LoadingButton
            loadingIndicator="Loading…"
            loading={loading}
            disabled={loading}
            type="submit"
            color="primary"
            variant="contained"
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </LoadingButton>
        </Grid>

      </Grid>
    </form>
  );
};

export default EstateForm;