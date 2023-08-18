import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:5000/api/v1";

export const VacationsContext = createContext();

export function VacationsProvider({ children }) {
  const [vacations, setVacations] = useState([]);
  const [reports, setReports] = useState([]);
  const [totalVacations, setTotalVacations] = useState([]);
  // const [currentVacation, setCurrentVacation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState({
    following: false,
    startingDate: `gt${new Date().toISOString()}`,
    page: 1,
    limit: 10,
    sort: "startingDate",
  });

  // Access the navigate function from react-router-dom
  // const navigate = useNavigate();
  const { logout } = useAuth();

  // Function to update the query object with new fields
  function insertQuery(field) {
    setQuery((query) => ({ ...query, ...field }));
  }

  // Build the query string from the query object
  const queryString = Object.entries(query)
    .filter((e) => e[1])
    .map((q, i) => {
      return `${i ? "&" : "?"}${q[0]}=${q[1]}`;
    })
    .join("");

  useEffect(() => {
    setError(null);

    const fetchVacations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/vacations${queryString}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.status === "fail") {
          if (data.error.statusCode === 401) {
            logout();
          }
          setError(data.message);
        }

        const vacations = data.data.vacations;

        const reports = vacations.map((v) => ({
          destination: v.destination,
          count: v.followers.length,
        }));

        setReports(reports);
        setVacations(vacations);
        setTotalVacations(data.pagination.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacations();
  }, [query, logout, queryString]);

  // async function createVacation(formData) {
  //   try {
  //     // setIsLoading(true);
  //     const response = await fetch(`${BASE_URL}/vacations`, {
  //       method: "POST",
  //       credentials: "include",
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (data.status === "fail") {
  //       if (data.error.statusCode === 401) {
  //         logout();
  //       }
  //       return setError(data.message);
  //     }

  //     let vacation = Array.from(formData.entries()).reduce(
  //       (obj, [key, value]) => {
  //         obj[key] = value;
  //         return obj;
  //       },
  //       {}
  //     );

  //     vacation.id = data.data.vacationId;

  //     // update state
  //     setVacations((prevVacations) => {
  //       prevVacations[0] = vacation;
  //       return prevVacations;
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     // setIsLoading(false);
  //   }
  // }

  async function createVacation(formData) {
    try {
      const response = await fetch(`${BASE_URL}/vacations`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const responseData = await response.json();

      if (!responseData.error) {
        let vacation = Array.from(formData.entries()).reduce(
          (obj, [key, value]) => {
            obj[key] = value;
            return obj;
          },
          {}
        );

        vacation.id = responseData.data.vacationId;

        setVacations((prevVacations) => {
          prevVacations[0] = vacation;
          return prevVacations;
        });
      }

      return responseData;
    } catch (err) {
      setError(err.message);
    } finally {
    }
  }

  // async function updateVacation(vacationId, formData) {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`${BASE_URL}/vacations/${vacationId}`, {
  //       method: "PATCH",
  //       credentials: "include",
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (data.status === "fail") {
  //       if (data.error.statusCode === 401) {
  //         logout();
  //       }
  //       setError(data.message);
  //       return { error: data.message };
  //     }
  //   } catch (err) {
  //     setError(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  async function updateVacation(vacationId, formData) {
    try {
      const response = await fetch(`${BASE_URL}/vacations/${vacationId}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const responseData = await response.json();

      if (!responseData.error) {
        setVacations((prevVacations) =>
          prevVacations.filter((vacation) => vacation.id !== vacationId)
        );
      }

      return responseData;
    } catch (err) {}
  }

  // async function removeVacation(vacationId) {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`${BASE_URL}/vacations/${vacationId}`, {
  //       method: "DELETE",
  //       credentials: "include",
  //     });

  //     const data = await response.json();

  //     if (data.status === "fail") {
  //       if (data.error.statusCode === 401) {
  //         logout();
  //       }
  //       setError(data.message);
  //       return false;
  //     }

  //     setVacations((prevVacations) =>
  //       prevVacations.filter((vacation) => vacation.id !== vacationId)
  //     );
  //     return true;
  //   } catch (err) {
  //     setError(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  async function removeVacation(vacationId) {
    try {
      const response = await fetch(`${BASE_URL}/vacations/${vacationId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const responseData = await response.json();

      if (!responseData.error) {
        setVacations((prevVacations) =>
          prevVacations.filter((vacation) => vacation.id !== vacationId)
        );
      }

      return responseData;
    } catch (err) {}
  }

  async function searchDestination(queryKey) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${BASE_URL}/vacations/search?key=${queryKey}`,
        {
          credentials: "include",
        }
      );

      const { data, error } = await response.json();

      if (error?.statusCode === 401) {
        logout();
      }

      setVacations(data.vacations);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const followVacation = useCallback(
    async function (vacation, userId) {
      try {
        const response = await fetch(
          `${BASE_URL}/vacations/${vacation.id}/follow`,
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
        } else if (data.status === "success") {
          setVacations((vacations) =>
            vacations.map((v) =>
              v.id === vacation.id
                ? { ...v, followers: [...v.followers, userId] }
                : v
            )
          );
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [logout]
  );

  const unfollowVacation = useCallback(
    async function (vacationId, userId) {
      try {
        const response = await fetch(
          `${BASE_URL}/vacations/${vacationId}/unfollow`,
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
        } else if (data.status === "success") {
          setVacations((vacations) =>
            vacations.map((v) =>
              v.id === vacationId
                ? {
                    ...v,
                    followers: v.followers.filter(
                      (followerId) => followerId !== userId
                    ),
                  }
                : v
            )
          );
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [logout]
  );

  return (
    <VacationsContext.Provider
      value={{
        vacations,
        followVacation,
        searchDestination,
        isLoading,
        error,
        insertQuery,
        query,
        updateVacation,
        createVacation,
        totalVacations,
        unfollowVacation,
        removeVacation,
        reports,
        hasNext: query.page * query.limit < totalVacations,
      }}
    >
      {children}
    </VacationsContext.Provider>
  );
}

export function useVacations() {
  const context = useContext(VacationsContext);
  if (context === undefined)
    throw new Error("Vacations context was used outside Vacations provider");

  return context;
}
