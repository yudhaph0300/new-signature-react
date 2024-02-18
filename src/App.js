import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import "./components/style.css";
import Chart from "chart.js/auto";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Furnitures from "./pages/Furnitures";

import Index from "./pages/admin/Index";
import Furniture from "./pages/admin/furniture/Furniture";
import Settings from "./pages/admin/Settings";
import AddFurniture from "./pages/admin/furniture/AddFurniture";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import Detail from "./pages/admin/furniture/Detail";
import Transactions from "./pages/admin/transactions";
import DetailTransaction from "./pages/admin/transactions/Detail";

import FurnituresResult from "./pages/FurnituresResult";
import Readme from "./pages/Readme";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import FurnitureDetails from "./pages/FurnitureDetails";
import Cart from "./pages/Cart";
import HistoryTransactions from "./pages/HistoryTransactions";
import HistoryDetail from "./pages/HistoryDetail";

import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/furnitures" element={<Furnitures />} />
          <Route
            path="/furnitures/:furnitureId"
            element={<FurnitureDetails />}
          />
          <Route path="/readme" element={<Readme />} />
          <Route
            path="/furnitures/result/:search"
            element={<FurnituresResult />}
          />

          <Route
            path="/history-transactions"
            element={<HistoryTransactions />}
          />
          <Route
            path="/history-transactions/:transactionId"
            element={<HistoryDetail />}
          />
          <Route path="/cart" element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/admin" element={<PrivateRouteAdmin />}>
            <Route path="/admin" element={<Index />} />
            <Route path="/admin/furniture" element={<Furniture />} />
            <Route path="/admin/furniture/:furnitureId" element={<Detail />} />
            <Route path="/admin/furniture/add" element={<AddFurniture />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route
              path="/admin/transactions/:transactionId"
              element={<DetailTransaction />}
            />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
      <Analytics />
    </>
  );
}

export default App;
