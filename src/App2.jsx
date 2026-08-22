import { BrowserRouter, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound";
import Login from "./pages/genaral/Login";
import SignUp from "./pages/genaral/SignUp";

export default function App2() {
  const notify = () => toast('Wow so easy !');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}