import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import UrunEkle from "./UrunEkle";
import FisHazirla from "./FisHazirla";

import reportWebVitals from "./reportWebVitals";
import { Route, Routes } from "react-router";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UrunEkle />} exact />
        <Route path="/fishazirla" element={<FisHazirla />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
