# Tech.Care Patient Dashboard

This project is a React single-page healthcare dashboard that displays patient information using live API data. It shows patient details, diagnosis history, vital signs, lab results, and health metrics in a clean and responsive user interface.

## Features

- Fetches patient data from the Coalition Technologies Patient Data API
- Displays only Jessica Taylor’s detailed profile
- Shows patient list with API profile images
- Displays diagnosis history using a Chart.js line chart
- Shows latest blood pressure, respiratory rate, temperature, and heart rate
- Displays diagnostic list from API data
- Displays lab results from API data
- Responsive design for desktop, tablet, and mobile screens

## Tech Stack

- React
- Vite
- CSS
- Chart.js
- react-chartjs-2

## API Used

The project uses the Patient Data API with Basic Authentication.

```js
const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
```

The app fetches all patients and filters the data.

## Project Setup

Install dependencies:


```bash
npm install
```


Run the project locally:

```bash
npm run dev
```

## Folder Structure

```text
health-care-dashboard/
├── public/
│   └── icons/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## API Response Example

The API returns an array of patient objects. Below is an example response structure:

```json
[
  {
    "name": "Jessica Taylor",
    "gender": "Female",
    "age": 28,
    "profile_picture": "https://fedskillstest.ct.digital/4.png",
    "date_of_birth": "1996-08-23",
    "phone_number": "(415) 555-1234",
    "emergency_contact": "(415) 555-5678",
    "insurance_type": "Sunrise Health Assurance",
    "diagnosis_history": [
      {
        "month": "March",
        "year": 2024,
        "blood_pressure": {
          "systolic": {
            "value": 160,
            "levels": "Higher than Average"
          },
          "diastolic": {
            "value": 78,
            "levels": "Lower than Average"
          }
        },
        "heart_rate": {
          "value": 78,
          "levels": "Lower than Average"
        },
        "respiratory_rate": {
          "value": 20,
          "levels": "Normal"
        },
        "temperature": {
          "value": 98.6,
          "levels": "Normal"
        }
      }
    ],
    "diagnostic_list": [
      {
        "name": "Hypertension",
        "description": "Chronic high blood pressure",
        "status": "Under Observation"
      }
    ],
    "lab_results": [
      "Blood Tests",
      "CT Scans"
    ]
  }
]
```


## Notes

- Patient data, profile images, diagnosis history, diagnostic list, and lab results are loaded from the API.
- Static files such as the logo, UI icons, doctor image, and layout styling are stored in the `public/icons` folder.
- The dashboard is designed to match the Adobe XD reference as closely as possible.
- The app focuses only on Jessica Taylor’s data as required by the task instructions.
