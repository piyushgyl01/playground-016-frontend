import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import GadgetDetails from "./pages/GadgetDetails";
import AddGadget from "./pages/AddGadget";

import { Provider } from "react-redux";

import { store } from "./app/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/gadget-details/:gadgetName/:gadgetId",
        element: <GadgetDetails />,
      },
      {
        path: "/add-gadget",
        element: <AddGadget />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <Homepage />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
