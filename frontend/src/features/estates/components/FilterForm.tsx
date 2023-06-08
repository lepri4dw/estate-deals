import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../../../app/hooks";
import {FromTo, SearchEstate} from "../../../types";
import {
  Button, Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import {fetchEstates} from "../estatesThunks";
import CloseIcon from '@mui/icons-material/Close';

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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(!open);
  const [state, setState] = useState<SearchEstate>({});
  const [currency, setCurrency] = useState('USD');
  const estateTypes = ['Квартира', 'Дом', 'Гараж', 'Участок', 'Коммерческое помещение'];
  const conditions = ['под самоотделку', 'хорошее', 'среднее', 'не достроено'];


  let priceLabel = 'цена ';

  if (state.usdPrice) {
    const gte = state.usdPrice.$gte ? `от ${state.usdPrice.$gte}` : '';
    const lte = state.usdPrice.$lte ? `до ${state.usdPrice.$lte}` : '';
    priceLabel += `${gte} ${lte} $`;
  } else if (state.kgsPrice) {
    const gte = state.kgsPrice.$gte ? `от ${state.kgsPrice.$gte}` : '';
    const lte = state.kgsPrice.$lte ? `до ${state.kgsPrice.$lte}` : '';
    priceLabel += `${gte} ${lte} сом`;
  }


  const onCurrencyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrency(e.target.value);
    setState(prev => ({
      ...prev, usdPrice: undefined, kgsPrice: undefined
    }))
  };

  useEffect(() => {
    if (Object.keys(state).length) {
      dispatch(fetchEstates(state));
    }
  }, [state, dispatch])


  const onFromToInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fullName: 'usdPrice' | 'kgsPrice' | 'floor') => {
      const { name, value } = e.target;
      setState((prev) => ({
        ...prev,
        [fullName]: { ...prev[fullName], [name]: value },
      }));
      setState((prev) => ({
        ...prev,
        [fullName]: prev[fullName] && filterState<FromTo>(prev[fullName] as FromTo),
      }));
    },
    [],
  );

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    setState(prev => filterState<SearchEstate>(prev));
  };

  const onDelete = (name: string) => {
    setState((prev) => ({...prev, [name]: undefined,}));
    setState(prev => filterState<SearchEstate>(prev));
  }

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value, numberOfRooms: ''}));
    setState(prev => filterState<SearchEstate>(prev));
  }

  const cleanFilters = () => {
    setState((prev) => ({
      ...prev, usdPrice: undefined, kgsPrice: undefined, floor: undefined, condition: undefined,
    }));
    setState(prev => filterState<SearchEstate>(prev));
  }

  return (
    <>
      <form>
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
                Купить
              </MenuItem>
              <MenuItem value="rent">
                Снять
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
            <Button color="primary" variant="contained" onClick={handleClose}>
              Ещё фильтры
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid container spacing={2} mt={1}>
        {(state.usdPrice || state.kgsPrice) && <Grid item>
          <Chip
            label={priceLabel}
            onDelete={() => onDelete(state.usdPrice ? 'usdPrice' : 'kgsPrice')}
          />
        </Grid>}
        {(state.floor) && <Grid item>
          <Chip
            label={`Этаж ${state.floor.$gte ? `от ${state.floor.$gte}` : ''} ${state.floor.$lte ? `до ${state.floor.$lte}` : ''}`}
            onDelete={() => onDelete('floor')}
          />
        </Grid>}
        {(state.condition) && <Grid item>
          <Chip
            label={`Состояние: ${state.condition || ''}`}
            onDelete={() => onDelete('floor')}
          />
        </Grid>}
        {(state.usdPrice || state.kgsPrice || state.floor || state.condition) && <Grid item xs>
          <Button variant="contained" onClick={cleanFilters}>
            Очистить
          </Button>
        </Grid>}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <Typography variant="h4">Ещё фильтры</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2} sx={{mt: 2}}>
              <Grid item xs container spacing={2}>
                <Grid item xs >
                  <Typography variant="h6" mb={2}>
                    Цена:
                  </Typography>
                </Grid>
                <Grid item xs>
                  <TextField
                    id="priceFrom"
                    label="От"
                    value={currency === 'USD' ? state.usdPrice?.$gte : state.kgsPrice?.$gte}
                    onChange={(e) => onFromToInputChange(e, currency === 'USD' ? 'usdPrice' : 'kgsPrice')}
                    name="$gte" type="number"
                    required
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    id="priceTo"
                    label="До"
                    value={currency === 'USD' ? state.usdPrice?.$lte : state.kgsPrice?.$lte}
                    onChange={(e) => onFromToInputChange(e, currency === 'USD' ? 'usdPrice' : 'kgsPrice')}
                    name="$lte" type="number"
                    required
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    id="currency"
                    label="Валюта"
                    select
                    value={currency}
                    onChange={onCurrencyChange}
                    name="currency"
                    required
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

              <Grid item xs container spacing={2}>
                <Grid item xs >
                  <Typography variant="h6" mb={2}>
                    Этаж:
                  </Typography>
                </Grid>
                <Grid item xs>
                  <TextField
                    id="floorFrom"
                    label="От"
                    value={state.floor?.$gte}
                    onChange={(e) => onFromToInputChange(e, 'floor')}
                    name="$gte" type="number" inputProps={{step: 1, min: -1}}
                    required
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    id="floorTo"
                    label="До"
                    value={state.floor?.$lte}
                    onChange={(e) => onFromToInputChange(e, 'floor')}
                    name="$lte" type="number" inputProps={{step: 1, min: -1}}
                    required
                  />
                </Grid>
              </Grid>

              <Grid item xs container spacing={2}>
                <Grid item xs>
                  <Typography variant="h6" mb={2}>
                    Состояние:
                  </Typography>
                </Grid>
                <Grid item xs>
                  {state.estateType !== 'Участок' && <Grid item xs>
                    <TextField
                      id="condition"
                      label="Состояние"
                      select
                      value={state.condition}
                      onChange={onChange}
                      name="condition"
                      required
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
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>Применить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterForm;