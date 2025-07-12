import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WindowContext from './WindowContext';
import { Typography } from '@mui/material';

export default function Window() {

  const { enableView, handleClose } = React.useContext(WindowContext);
  return (
    <div>
      <Modal
        open={!enableView}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="section" className="p-4 z-50 opacity-80 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg w-[80%] h-[80%] ">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            1 + 1 = ?
           </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Your answer is:
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
