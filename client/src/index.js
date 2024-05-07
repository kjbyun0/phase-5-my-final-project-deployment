import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./index.css";
import 'semantic-ui-css/semantic.min.css'
// import App from "./pages/App";

import routes from './routes';

const router = createBrowserRouter(routes);

const container = document.getElementById("root");
const root = createRoot(container);
// root.render(<App />);
root.render(<RouterProvider router={router} />);
