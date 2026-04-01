import axios from "axios";

const API_URL = "https://gbi-team-filesystem.s3.us-east-1.amazonaws.com/flights.json";

export const getFlightsData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// export const getFlightsData =
// [
//   {
//     "id": "fc704c16fd79",
//     "company": "US Airlines",
//     "points": 25000,
//     "duration": 590,
//     "segment": [
//       {
//         "duration": 590,
//         "departureTime": "2023-10-10T21:30-03:00",
//         "arrivalTime": "2023-10-11T06:20-04:00",
//         "origin": "Sao Paulo",
//         "destination": "New York"
//       }
//     ]
//   },
//   {
//     "id": "fc704c16fd75",
//     "company": "UK Airlines",
//     "points": 25000,
//     "duration": 590,
//     "segment": [
//       {
//         "duration": 590,
//         "departureTime": "2023-10-10T21:30-06:00",
//         "arrivalTime": "2023-10-11T06:20-11:00",
//         "origin": "London",
//         "destination": "New York"
//       }
//     ]
//   },
//   {
//     "id": "fc704c16fd56",
//     "company": "German Airlines",
//     "points": 25000,
//     "duration": 590,
//     "segment": [
//       {
//         "duration": 590,
//         "departureTime": "2023-10-10T21:30-08:00",
//         "arrivalTime": "2023-10-11T06:20-11:00",
//         "origin": "Germany",
//         "destination": "New York"
//       }
//     ]
//   },
//   {
//     "id": "3fe21e46fd78",
//     "company": "Dalta",
//     "points": 20000,
//     "duration": 862,
//     "segment": [
//       {
//         "duration": 635,
//         "departureTime": "2023-10-16T20:25-03:00",
//         "arrivalTime": "2023-10-17T06:00-04:00",
//         "origin": "Sao Paulo",
//         "destination": "Toronto",
//         "connectionDuration": 125
//       },
//       {
//         "duration": 102,
//         "departureTime": "2023-10-17T08:05-04:00",
//         "arrivalTime": "2023-10-17T09:47-04:00",
//         "origin": "Toronto",
//         "destination": "New York"
//       }
//     ]
//   },
//   {
//     "id": "8bf2b3d7be09",
//     "company": "Aviana",
//     "points": 17000,
//     "duration": 1050,
//     "segment": [
//       {
//         "duration": 515,
//         "departureTime": "2023-10-10T21:25-03:00",
//         "arrivalTime": "2023-10-11T05:00-04:00",
//         "origin": "Sao Paulo",
//         "destination": "Miami",
//         "connectionDuration": 145
//       },
//       {
//         "duration": 192,
//         "departureTime": "2023-10-11T07:25-04:00",
//         "arrivalTime": "2023-10-11T10:37-04:00",
//         "origin": "Miami",
//         "destination": "Toronto",
//         "connectionDuration": 98
//       },
//       {
//         "duration": 100,
//         "departureTime": "2023-10-11T12:15-04:00",
//         "arrivalTime": "2023-11T13:55-04:00",
//         "origin": "Toronto",
//         "destination": "New York"
//       }
//     ]
//   }
// ]
