import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { IVacation } from "../global/types";
import config from "../config";

interface Vacation {
  id: number;
  destination: string;
  followers: number[];
  imgUrl: string;
  startingDate: string;
  endingDate: string;
  description: string;
  price: number;
}

interface Query {
  following: boolean;
  startingDate: string | undefined;
  endingDate: string | undefined;
  page: number;
  limit: number;
  sort: string;
}

interface VacationsContextValue {
  vacations: Vacation[];
  reports: { destination: string; count: number }[];
  totalVacations: number;
  isLoading: boolean;
  error: string | null;
  query: Query;
  insertQuery: (field: Partial<Query>) => void;
  followVacation: (
    vacation: Vacation,
    userId: number | undefined
  ) => Promise<void>;
  searchDestination: (queryKey: string) => Promise<any>;
  updateVacation: (vacation: IVacation, formData: FormData) => Promise<void>;
  createVacation: (formData: FormData) => Promise<any>;
  unfollowVacation: (
    vacationId: number,
    userId: number | undefined
  ) => Promise<any>;
  removeVacation: (vacationId: number) => Promise<any>;
  hasNext: boolean;
}

const VacationsContext = createContext<VacationsContextValue | undefined>(
  undefined
);

export function VacationsProvider({ children }: { children: React.ReactNode }) {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [reports, setReports] = useState<
    { destination: string; count: number }[]
  >([]);
  const [totalVacations, setTotalVacations] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<Query>({
    following: false,
    startingDate: undefined,
    endingDate: undefined,
    page: 1,
    limit: 10,
    sort: "startingDate",
  });

  const { logout } = useAuth();

  const insertQuery = useCallback((field: Partial<Query>) => {
    setQuery((query) => ({ ...query, ...field }));
  }, []);

  const fetchVacations = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const queryString = Object.entries(query)
        .filter(([_, value]) => value)
        .map(
          ([key, value], index) => `${index === 0 ? "?" : "&"}${key}=${value}`
        )
        .join("");

      const response = await fetch(
        `${config.API_BASE_URL}/vacations${queryString}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "fail") {
        if (data.error.statusCode === 401) {
          logout();
        }
        setError(data.message);
      } else {
        const vacationsData = data.data.vacations;

        const reportsData = vacationsData.map((v: Vacation) => ({
          destination: v.destination,
          count: v.followers.length,
        }));

        setReports(reportsData);
        setVacations(vacationsData);
        setTotalVacations(data.pagination.total);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [query, logout]);

  useEffect(() => {
    fetchVacations();
  }, [fetchVacations]);

  async function createVacation(formData: FormData) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/vacations`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        let vacation = Array.from(formData.entries()).reduce(
          (obj: any, [key, value]) => {
            obj[key] = value;
            return obj;
          },
          {}
        );

        vacation.id = responseData.data.vacationId;
        vacation.followers = [];
        vacation.imgUrl = `${config.API_BASE_URL}/images/${vacation.imgUrl?.name}`;

        setVacations((prevVacations) => {
          prevVacations.unshift(vacation);
          return prevVacations;
        });
      }

      return responseData;
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateVacation(vacation: IVacation, formData: FormData) {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/vacations/${vacation.id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        setVacations((prevVacations) => [
          ...prevVacations.filter((v) => v.id !== vacation.id),
          vacation,
        ]);
      }

      return responseData;
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function removeVacation(vacationId: number) {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/vacations/${vacationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        setVacations((prevVacations) =>
          prevVacations.filter((vacation) => vacation.id !== vacationId)
        );
      }
      return responseData;
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function searchDestination(queryKey: string) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${config.API_BASE_URL}/vacations/search?key=${queryKey}`,
        {
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        logout();
      }

      setVacations(responseData.data.vacations);
      return responseData;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function followVacation(
    vacation: Vacation,
    userId: number | undefined
  ) {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/vacations/${vacation.id}/follow`,
        {
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        setVacations((vacations) =>
          vacations.map((v) =>
            v.id === vacation.id
              ? { ...v, followers: [...v.followers, userId || 0] }
              : v
          )
        );
      }

      return responseData;
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function unfollowVacation(
    vacationId: number,
    userId: number | undefined
  ) {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/vacations/${vacationId}/unfollow`,
        {
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        setVacations((vacations) =>
          vacations.map((v) =>
            v.id === vacationId
              ? {
                  ...v,
                  followers: v.followers.filter(
                    (followerId) => followerId !== (userId || 0)
                  ),
                }
              : v
          )
        );
      }

      return responseData;
    } catch (err: any) {
      setError(err.message);
    }
  }

  const hasNext = query.page * query.limit < totalVacations;

  const value: VacationsContextValue = {
    vacations,
    reports,
    totalVacations,
    isLoading,
    error,
    query,
    insertQuery,
    followVacation,
    searchDestination,
    updateVacation,
    createVacation,
    unfollowVacation,
    removeVacation,
    hasNext,
  };

  return (
    <VacationsContext.Provider value={value}>
      {children}
    </VacationsContext.Provider>
  );
}

export function useVacations() {
  const context = useContext(VacationsContext);
  if (context === undefined) {
    throw new Error("useVacations must be used within a VacationsProvider");
  }
  return context;
}
