import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useVacations } from "../../contexts/VacationsContext";
import Spinner from "../../components/Spinner";

import styles from "./Reports.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

const Reports: React.FC = () => {
  const { reports, isLoading } = useVacations();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    setChartData(prepareChartData(reports));
  }, [reports]);

  const prepareChartData = (reports: any[]) => {
    return {
      labels: reports?.map((report: any) => report.destination) ?? [],
      datasets: [
        {
          label: "Followers",
          data: reports?.map((report: any) => report.count) ?? [],
          backgroundColor: "#fed971",
        },
      ],
    };
  };

  const hasData = reports.length > 0 && chartData;

  return (
    <main className={styles.reports}>
      <section>
        {isLoading ? (
          <Spinner />
        ) : hasData ? (
          <>
            <Bar options={options} data={chartData} />
            <CSVLink
              filename={"vacations_reports-followers.csv"}
              data={reports}
            >
              Download reports
            </CSVLink>
          </>
        ) : (
          <p>No data available.</p>
        )}
      </section>
    </main>
  );
};

export default Reports;
