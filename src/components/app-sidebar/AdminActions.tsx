import React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdQueryStats } from "react-icons/md";
import useModal, { ReusableModal } from "../../hooks/useModal";
import CreateVacation from "../create-vacation/CreateVacation";
import { useVacations } from "../../contexts/VacationsContext";

interface AdminActionsProps {}

const AdminActions: React.FC<AdminActionsProps> = () => {
  const { openModal, isOpen, closeModal } = useModal();

  return (
    <>
      <ul>
        <li onClick={openModal}>
          <p>Create vacation</p>
          <IoMdAddCircleOutline />
        </li>
      </ul>

      <ReusableModal isOpen={isOpen} onClose={closeModal}>
        <CreateVacation onSuccess={closeModal} />
      </ReusableModal>
    </>
  );
};

export default AdminActions;
