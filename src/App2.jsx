import { BrowserRouter, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound";

export default function App2() {
  const notify = () => toast('Wow so easy !');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}