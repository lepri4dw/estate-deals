import React from 'react';
import {Dialog, DialogContent} from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
  title: string;
  image: string;
}

const ImageModal: React.FC<Props> = ({ open, handleClose, title, image }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent sx={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={image} alt={title} style={{ maxHeight: 'calc(100vh - 200px)', maxWidth: '100%',  width: 'auto', height: 'auto', }} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;