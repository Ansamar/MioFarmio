//
//  api.ts
//  
//
//  Created by Mario Ansaldi on 10/09/25.
//
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // backend FastAPI
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
