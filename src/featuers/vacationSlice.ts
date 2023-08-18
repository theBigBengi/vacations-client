import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Vacation {
  id: number;
  destination: string;
  description: string;
  price: number;
  imgUrl: string;
  startingDate: Date;
  endingDate: Date;
}
const initialState: Array<Vacation> = [
  {
    id: 1,
    destination: "test",
    description: "test",
    price: 1200,
    imgUrl: "test",
    startingDate: new Date(),
    endingDate: new Date(),
  },
];

export const vacationSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {
    getVacations: (state, action: PayloadAction<Vacation>) => {
      state.push(action.payload);
    },
  },
});
export const { getVacations } = vacationSlice.actions;
export const vacationSelector = (state: RootState) => state.vacationReducer;
export default vacationSlice.reducer;
