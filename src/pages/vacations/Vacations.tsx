import React, { useState } from "react";
import Spinner from "../../components/Spinner";
import Card from "../../components/card/Card";
import { useVacations } from "../../contexts/VacationsContext";
import Message from "../../components/message/Message";
import useModal, { ReusableModal } from "../../hooks/useModal";
import CreateVacation from "../../components/create-vacation/CreateVacation";
import { IVacation } from "../../global/types";
import { useAuth } from "../../contexts/AuthContext";

import styles from "./Vacations.module.css";
import { NotificationManager } from "react-notifications";

// Button to add a new vacation (visible only for admin)
const ConfirmDelete: React.FC<{
  deletingText: string;
  selectedVacation: IVacation | null;
  handleRemoveVacation: () => void;
  setDeletingText: (text: string) => void;
}> = ({
  deletingText,
  selectedVacation,
  handleRemoveVacation,
  setDeletingText,
}) => {
  const confirmed = deletingText === "DELETE_VACATION";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
        alignItems: "center",
      }}
    >
      <Message
        message={`You are asking for delete a vacation (id:${selectedVacation?.id})`}
      />
      <p>
        Insert <b style={{ color: "red", fontWeight: 900 }}>DELETE_VACATION</b>{" "}
        to confirm
      </p>
      <input onChange={({ target }) => setDeletingText(target.value)} />
      <button
        onClick={handleRemoveVacation}
        disabled={!confirmed}
        style={{
          padding: "0.5rem",
          backgroundColor: confirmed ? "red" : "#fc9f9f",
          color: "white",
          borderRadius: 5,
          textTransform: "uppercase",
          fontWeight: 900,
          border: "2px solid red",
          boxShadow: "none",
        }}
      >
        delete
      </button>
    </div>
  );
};

// Button to add a new vacation (visible only for admin)
const AddVacationBtn: React.FC<{
  setVacation: React.Dispatch<React.SetStateAction<IVacation | null>>;
  openModal: () => void;
  isAdmin: boolean;
}> = ({ setVacation, openModal, isAdmin }) => {
  if (!isAdmin) return null;

  const handleClick = () => {
    setVacation(null);
    openModal();
  };

  return (
    <button className={styles.addBtn} onClick={handleClick}>
      +
    </button>
  );
};

// List of vacations
const VacationsList: React.FC<{
  onEditClick: (vacationId: IVacation["id"]) => void;
  onRemoveClick: (vacationId: IVacation["id"]) => void;
  vacations: IVacation[];
}> = ({ onEditClick, vacations, onRemoveClick }) => {
  return (
    <>
      {vacations.map((vacation: IVacation) => (
        <Card
          key={`vacation-${vacation.id}`}
          onRemoveClick={onRemoveClick}
          onEditClick={onEditClick}
          vacation={vacation}
        />
      ))}
    </>
  );
};

const Vacations: React.FC<VacationsProps> = () => {
  const [selectedVacation, setVacation] = useState<IVacation | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deletingText, setDeletingText] = useState("");

  const { vacations, isLoading, removeVacation } = useVacations();
  const { openModal, isOpen, closeModal } = useModal();
  const { isAdmin } = useAuth();

  const noResults: boolean = !vacations.length;

  // Handler for editing a vacation
  const handleEditClick = (vacationId: IVacation["id"]) => {
    const current = vacations.find((v) => v.id === vacationId);
    if (current) {
      setDeleting(false);
      setVacation(current);
      openModal();
    }
  };

  // Handler for editing a vacation
  const handleRemoveClick = async (vacationId: IVacation["id"]) => {
    const current = vacations.find((v) => v.id === vacationId);
    if (current) {
      setVacation(current);
      setDeleting(true);
      setDeletingText("");
      openModal();
    }
  };

  // Handler for editing a vacation
  const handleRemoveVacation = async () => {
    closeModal();

    if (!selectedVacation || deletingText !== "DELETE_VACATION") return;

    const response = await removeVacation(selectedVacation.id);

    if (response.error) {
      return NotificationManager.error(response.message, "Error", 3000);
    }

    NotificationManager.success(
      `Vacation deleted successfully (id:${selectedVacation.id})`,
      "Deleted",
      3000
    );
  };

  // Handler for editing a vacation
  const handleCloseModal = () => {
    setVacation(null);
    setDeleting(false);
    setDeletingText("");
    closeModal();
  };

  return (
    <main className={styles.vacations}>
      <section>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <AddVacationBtn
              isAdmin={isAdmin}
              openModal={openModal}
              setVacation={setVacation}
            />

            <VacationsList
              onRemoveClick={handleRemoveClick}
              onEditClick={handleEditClick}
              vacations={vacations}
            />

            <ReusableModal isOpen={isOpen} onClose={handleCloseModal}>
              <button className='closeModal' onClick={handleCloseModal}>
                X
              </button>
              {deleting ? (
                <ConfirmDelete
                  handleRemoveVacation={handleRemoveVacation}
                  selectedVacation={selectedVacation}
                  setDeletingText={setDeletingText}
                  deletingText={deletingText}
                />
              ) : (
                <CreateVacation
                  vacation={selectedVacation}
                  onSuccess={closeModal}
                />
              )}
            </ReusableModal>
          </>
        )}

        {noResults && !isLoading && <Message message='No results' />}
      </section>
    </main>
  );
};

interface VacationsProps {}

export default Vacations;
