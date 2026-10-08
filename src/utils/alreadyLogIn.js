import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { errorToast } from "./customToast";

const useAlreadyLogIn = (message = "আপনি ইতিমধ্যেই লগইন করেছেন", redirectTo = "/") => {
  const ran = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (localStorage.getItem("token")) {
      errorToast(message);
      navigate(redirectTo, { replace: true });
    }
  }, [message, redirectTo, navigate]);
};

export default useAlreadyLogIn;