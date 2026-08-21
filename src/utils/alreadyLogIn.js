import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { errorToast } from "./toast";

const useAlreadyLogIn = (message = "You are already logged in", redirectTo = "/") => {
  const ran = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      errorToast(message)
      navigate(redirectTo);
    }
  }, [message, redirectTo, navigate]);
};

export default useAlreadyLogIn;