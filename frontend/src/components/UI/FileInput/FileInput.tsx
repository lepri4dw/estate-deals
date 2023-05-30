import React, {useRef, useState} from 'react';
import { Button, Grid, TextField } from '@mui/material';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  error?: boolean;
  helperText?: string;
}

const FileInput: React.FC<Props> = ({onChange, name, label, error, helperText}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filenames, setFilenames] = useState<string[]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFilenames = Array.from(e.target.files).map((file) => file.name);
      setFilenames(newFilenames);
    } else {
      setFilenames([]);
    }
    onChange(e);
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{display: 'none'}}
        type="file"
        name={name}
        onChange={onFileChange}
        multiple
        ref={inputRef}
        accept={'image/*'}
      />
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            disabled
            label={label}
            value={filenames.join(', ')}
            onClick={activateInput}
            error={error}
            helperText={helperText}
          />
        </Grid>
        <Grid item>
          <Button type="button" variant="contained" onClick={activateInput}>Browse</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;