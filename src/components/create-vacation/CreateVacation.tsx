import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../text-input/Field";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useVacations } from "../../contexts/VacationsContext";
import { NotificationManager } from "react-notifications";
import ImageUpload from "../image-upload/ImageUpload";
import { IVacation } from "../../global/types";

import styles from "./CreateVacation.module.css";
import Button from "../Button";

export {};

interface FormState {
  description: string;
  destination: string;
  imgUrl: File | any;
  price: number | string | undefined;
  startingDate: Date | null;
  endingDate: Date | null;
}

interface CreateVacationProps {
  vacation?: VacationType | null;
  onSuccess: () => void;
}

interface VacationType {
  id: number;
  description: string;
  destination: string;
  imgUrl: string;
  price: number | string | undefined;
  startingDate: string;
  endingDate: string;
}

const CreateVacation: React.FC<CreateVacationProps> = ({
  vacation,
  onSuccess,
}) => {
  const { updateVacation, createVacation, isLoading } = useVacations();

  const [errors, setErrors] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | undefined>(
    vacation?.imgUrl
  );
  const [formData, setFormData] = useState<FormState>({
    description: vacation?.description || "",
    destination: vacation?.destination || "",
    imgUrl: vacation?.imgUrl || null,
    price: vacation?.price || "",
    startingDate: vacation ? new Date(vacation?.startingDate) : null,
    endingDate: vacation ? new Date(vacation?.endingDate) : null,
  });

  // Event handlers
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //TODO: validate inputs before sending request

    const form = new FormData(e.target as HTMLFormElement);
    const response = await (vacation
      ? updateVacation(vacation as IVacation, form)
      : createVacation(form));

    if (response.error) {
      setErrors(response.message);
      return NotificationManager.error(response.message, "Error", 3000);
    }

    const actionMessage = vacation ? "updated" : "created";
    const vacationId = vacation ? `(id:${vacation.id})` : "";

    NotificationManager.success(
      `Vacation ${actionMessage} successfully ${vacationId}`,
      vacation ? "Updated" : "Created",
      3000
    );

    onSuccess();
  };

  const isFormValid = () => {
    const {
      description,
      destination,
      imgUrl,
      startingDate,
      endingDate,
      price,
    } = formData;
    return (
      description &&
      destination &&
      imgUrl &&
      startingDate &&
      endingDate &&
      price
    );
  };

  return (
    <main className={styles.createVacation}>
      <section>
        <h2>{vacation ? "Update Vacation" : "Create Vacation"}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Form fields */}
          <Field error={errors} label='Destination' name='destination'>
            <input
              type='text'
              name='destination'
              onChange={handleInputChange}
              value={formData.destination}
              maxLength={20}
              minLength={2}
            />
          </Field>

          <Field error={errors} label='Price' name='price'>
            <input
              type='number'
              name='price'
              onChange={handleInputChange}
              value={formData.price}
            />
          </Field>

          <Field error={errors} label='Description' name='description'>
            <textarea
              style={{ height: 150 }}
              name='description'
              value={formData.description}
              onChange={handleInputChange}
            />
          </Field>

          <Field error={errors} label='Starting date' name='startingDate'>
            <DatePicker
              name='startingDate'
              dateFormat='yyyy-MM-dd'
              selected={formData.startingDate}
              onChange={(date: Date) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  startingDate: date,
                }))
              }
            />
          </Field>

          <Field error={errors} label='Ending date' name='endingDate'>
            <DatePicker
              name='endingDate'
              dateFormat='yyyy-MM-dd'
              selected={formData.endingDate}
              onChange={(date: Date) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  endingDate: date,
                }))
              }
            />
          </Field>

          <Field error={errors} label='Image' name='imgUrl'>
            <ImageUpload
              name='imgUrl'
              setFile={(file: File) =>
                setFormData((prevFromData: FormState) => ({
                  ...prevFromData,
                  imgUrl: file,
                }))
              }
              preview={previewImg}
              setPreview={setPreviewImg}
            />
          </Field>

          <Button
            className={styles.submit}
            type='submit'
            disabled={isLoading || !isFormValid()}
          >
            {isLoading
              ? "Sending request..."
              : vacation
              ? "Update vacation"
              : "Create vacation"}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default CreateVacation;
