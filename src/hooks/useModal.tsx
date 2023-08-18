import { useState, ReactNode, useEffect } from "react";
import Modal from "react-modal";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 20,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      maxWidth: "400px",
      width: "100%",
      padding: "20px",
      borderRadius: 10,
      // position: "relative",
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
      {children}
    </Modal>
  );
};

const useModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (_?: any, callback?: any) => {
    setModalIsOpen(true);
    callback?.call();
  };

  const closeModal = (_?: any, callback?: any) => {
    setModalIsOpen(false);
    callback?.call();
  };

  // Return the modal component as part of the hook's return value
  const ModalComponent = ({ children }: any) => (
    <ReusableModal isOpen={modalIsOpen} onClose={closeModal}>
      {children}
    </ReusableModal>
  );

  return {
    isOpen: modalIsOpen,
    openModal,
    closeModal,
    ModalComponent,
  };
};

export default useModal;
