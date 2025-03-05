import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { styled, SxProps } from "@mui/material/styles";
import React from "react";

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(4),
  maxWidth: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`
}));

type MyModalProps = {
  /**
   * ID of modal for ARIA
   */
  id: string,
  /**
   * Modal open boolean state
   */
  modalOpen: boolean;
  /**
   * Set modal open state
   */
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Content to add to modal
   */
  children: React.ReactNode;
  /**
   * Styling properties to add to modal
   */
  sxProps?: SxProps;
}
/**
 * Modal to show information
 */
export function MyModal(props: MyModalProps) {
  const { id, children, modalOpen, setModalOpen, sxProps } = props;

  return <Modal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    aria-labelledby={`modal-${id}-title`}
    aria-describedby={`modal-${id}-desc`}
  >
    <ModalContent sx={sxProps}>
      {children}
    </ModalContent>
  </Modal>
}