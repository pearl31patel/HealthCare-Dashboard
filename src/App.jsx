import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const USERNAME = "coalition";
const PASSWORD = "skills-test";


function formatApiLabel(key) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateText) {
  return new Date(dateText).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function App() {
  const [patients, setPatients] = useState([]);
  const [jessica, setJessica] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const token = btoa(`${USERNAME}:${PASSWORD}`);

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      const data = await response.json();

      setPatients(data);

      const selectedPatient = data.find(
        (patient) => patient.name === "Jessica Taylor"
      );

      setJessica(selectedPatient);
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  if (!jessica) {
    return <h2 className="loading">Loading patient dashboard...</h2>;
  }

  const latest = jessica.diagnosis_history[0];
  const lastSixMonths = jessica.diagnosis_history.slice(0, 6).reverse();

  const vitalEntries = Object.entries(latest).filter(([key, value]) => {
    return (
      key !== "month" &&
      key !== "year" &&
      key !== "blood_pressure" &&
      value &&
      typeof value === "object" &&
      "value" in value &&
      "levels" in value
    );
  });

  const vitalUi = {
    respiratory_rate: {
      icon: "/icons/respiratory_rate.svg",
      className: "blue",
      unit: "bpm",
    },
    temperature: {
      icon: "/icons/temperature.svg",
      className: "peach",
      unit: "°F",
    },
    heart_rate: {
      icon: "/icons/HeartBPM.svg",
      className: "pinkBox",
      unit: "bpm",
    },
  };

  const chartData = {
    labels: lastSixMonths.map(
      (item) => `${item.month.slice(0, 3)}, ${item.year}`
    ),
    datasets: [
      {
        label: formatApiLabel("systolic"),
        data: lastSixMonths.map((item) => item.blood_pressure.systolic.value),
        borderColor: "#e66cc7",
        backgroundColor: "#e66cc7",
        tension: 0.4,
        pointRadius: 6,
      },
      {
        label: formatApiLabel("diastolic"),
        data: lastSixMonths.map((item) => item.blood_pressure.diastolic.value),
        borderColor: "#8d72e1",
        backgroundColor: "#8d72e1",
        tension: 0.4,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 24,
        top: 10,
        bottom: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 60,
        max: 180,
        ticks: {
          stepSize: 20,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 4,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div>
      <header className="topbar">
        <div className="logo">
          <img src="/icons/logo.svg" alt="Tech.Care Logo" />
        </div>

        <nav className="navMenu">
          <span className="navItem">
            <img src="/icons/home.svg" alt="Overview" />
            Overview
          </span>

          <span className="navItem activeNav">
            <img src="/icons/group.svg" alt="Patients" />
            Patients
          </span>

          <span className="navItem">
            <img src="/icons/calendar.svg" alt="Schedule" />
            Schedule
          </span>

          <span className="navItem">
            <img src="/icons/chat.svg" alt="Message" />
            Message
          </span>

          <span className="navItem">
            <img src="/icons/credit.svg" alt="Transactions" />
            Transactions
          </span>
        </nav>

        <div className="doctorArea">
          <div className="doctor">
            <img src="/icons/people/jose_simmons.png" alt="Dr. Jose Simmons" />

            <div>
              <strong>Dr. Jose Simmons</strong>
              <p>General Practitioner</p>
            </div>
          </div>

          <div className="doctorActions">
            <img src="/icons/settings.svg" alt="Settings" />
            <img src="/icons/more.svg" alt="More" />
          </div>
        </div>
      </header>

      <main className="dashboard">
        <aside className="patientsBox">
          <div className="boxHeader">
            <h2>Patients</h2>
            <img className="searchIcon" src="/icons/search.svg" alt="Search" />
          </div>

          <div className="patientList">
            {patients.map((patient) => (
              <div
                key={patient.name}
                className={
                  patient.name === "Jessica Taylor"
                    ? "patient activePatient"
                    : "patient"
                }
              >
                <img src={patient.profile_picture} alt={patient.name} />
                <div>
                  <h4>{patient.name}</h4>
                  <p>
                    {patient.gender}, {patient.age}
                  </p>
                </div>
                <span className="dots">...</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="centerArea">
          <section className="card">
            <h2>Diagnosis History</h2>

            <div className="chartBox">
              <div className="chartArea">
                <div className="chartTitle">
                  <h3>{formatApiLabel("blood_pressure")}</h3>
                  <p className="monthFilter">
                    Last 6 months
                    <img src="/icons/expand_more.svg" alt="Expand" />
                  </p>
                </div>

                <div className="chartCanvas">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              <div className="bpInfo">
                <div>
                  <p className="legend pink">{formatApiLabel("systolic")}</p>
                  <h2>{latest.blood_pressure.systolic.value}</h2>
                  <p className="levelText">
                    <img
                      className="levelIcon"
                      src="/icons/arrow_up.svg"
                      alt="Higher"
                    />
                    {latest.blood_pressure.systolic.levels}
                  </p>
                </div>

                <hr />

                <div>
                  <p className="legend purple">{formatApiLabel("diastolic")}</p>
                  <h2>{latest.blood_pressure.diastolic.value}</h2>
                  <p className="levelText">
                    <img
                      className="levelIcon"
                      src="/icons/arrow_down.svg"
                      alt="Lower"
                    />
                    {latest.blood_pressure.diastolic.levels}
                  </p>
                </div>
              </div>
            </div>

            <div className="vitalGrid">
              {vitalEntries.map(([key, vital]) => {
                const ui = vitalUi[key] || {};
                const unit = ui.unit || "";

                const levelText = vital.levels.toLowerCase();
                const isHigher = levelText.includes("higher");
                const isLower = levelText.includes("lower");

                return (
                  <div className={`vital ${ui.className || ""}`} key={key}>
                    <div className="icon">
                      <img src={ui.icon} alt={formatApiLabel(key)} />
                    </div>

                    <p>{formatApiLabel(key)}</p>

                    <h2>
                      {vital.value}
                      {unit === "°F" ? unit : unit ? ` ${unit}` : ""}
                    </h2>

                    <span className={isHigher || isLower ? "levelText" : ""}>
                      {(isHigher || isLower) && (
                        <img
                          className="levelIcon"
                          src={
                            isHigher
                              ? "/icons/arrow_up.svg"
                              : "/icons/arrow_down.svg"
                          }
                          alt={vital.levels}
                        />
                      )}
                      {vital.levels}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card">
            <h2>Diagnostic List</h2>

            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>Problem/Diagnosis</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {jessica.diagnostic_list.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <aside className="rightArea">
          <section className="card profile">
            <img
              className="profileImage"
              src={jessica.profile_picture}
              alt={jessica.name}
            />

            <h2>{jessica.name}</h2>

            <div className="infoList">
              <Info
                icon="/icons/birth.svg"
                label={formatApiLabel("date_of_birth")}
                value={formatDate(jessica.date_of_birth)}
              />
              <Info
                icon="/icons/female.svg"
                label={formatApiLabel("gender")}
                value={jessica.gender}
              />
              <Info
                icon="/icons/phone.svg"
                label={formatApiLabel("phone_number")}
                value={jessica.phone_number}
              />
              <Info
                icon="/icons/phone.svg"
                label={formatApiLabel("emergency_contact")}
                value={jessica.emergency_contact}
              />
              <Info
                icon="/icons/insurance.svg"
                label={formatApiLabel("insurance_type")}
                value={jessica.insurance_type}
              />
            </div>

            <button>Show All Information</button>
          </section>

          <section className="card labResults">
            <h2>Lab Results</h2>

            {jessica.lab_results.map((lab) => (
              <div className="labItem" key={lab}>
                <span>{lab}</span>
                <img
                  className="downloadIcon"
                  src="/icons/download.svg"
                  alt="Download"
                />
              </div>
            ))}
          </section>
        </aside>
      </main>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="infoItem">
      <span className="infoIcon">
        <img src={icon} alt={label} />
      </span>

      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default App;
