import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSelectedProject } from "../utils/selectedProjectSlice";
import { showToast } from "../utils/constants";
import { logout as logoutAction } from "../utils/userSlice";

const AuthContext = createContext(null);

const LAST_ACTIVITY_KEY = "lastActivity";
const DEFAULT_SESSION_TIMEOUT_MINUTES = 15;

const getTimeoutDuration = () => {
  const configuredMinutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES);

  if (Number.isFinite(configuredMinutes) && configuredMinutes > 0) {
    return configuredMinutes * 60 * 1000;
  }

  return DEFAULT_SESSION_TIMEOUT_MINUTES * 60 * 1000;
};

const TIMEOUT_DURATION = getTimeoutDuration();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userToken = useSelector((state) => state.auth.userToken);
  const timeoutRef = useRef(null);
  const [timeoutReason, setTimeoutReason] = useState(null);

  const isPublicRoute =
    location.pathname === "/" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/") ||
    location.pathname === "/unauthorized";

  const isAuthenticated =
    Boolean(userToken) ||
    Boolean(localStorage.getItem("userToken")) ||
    Boolean(localStorage.getItem("authToken"));

  const clearSessionTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const logout = useCallback(
    (reason = "manual") => {
      dispatch(clearSelectedProject());
      dispatch(logoutAction());

      localStorage.removeItem("authToken");
      localStorage.removeItem(LAST_ACTIVITY_KEY);

      clearSessionTimeout();
      setTimeoutReason(reason);

      if (reason === "inactive") {
        showToast("Session timed out due to inactivity. Please sign in again.", "error");
      }

      if (!isPublicRoute) {
        navigate("/", { replace: true });
      }
    },
    [clearSessionTimeout, dispatch, isPublicRoute, navigate],
  );

  const checkInactivity = useCallback(() => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (!lastActivity) {
      return 0;
    }

    const elapsed = Date.now() - Number(lastActivity);

    if (elapsed > TIMEOUT_DURATION) {
      logout("inactive");
      return false;
    }

    return elapsed;
  }, [logout]);

  const scheduleTimeout = useCallback(
    (remainingTime = TIMEOUT_DURATION) => {
      clearSessionTimeout();

      timeoutRef.current = setTimeout(() => {
        logout("inactive");
      }, remainingTime);
    },
    [clearSessionTimeout, logout],
  );

  const resetTimeout = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    scheduleTimeout(TIMEOUT_DURATION);
  }, [isAuthenticated, scheduleTimeout]);

  const login = useCallback(() => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    setTimeoutReason(null);
    scheduleTimeout(TIMEOUT_DURATION);
  }, [scheduleTimeout]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearSessionTimeout();
      setTimeoutReason(null);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      return;
    }

    const inactiveTime = checkInactivity();
    if (inactiveTime === false) {
      return;
    }

    if (inactiveTime > 0) {
      const remainingTime = TIMEOUT_DURATION - inactiveTime;

      if (remainingTime > 0) {
        scheduleTimeout(remainingTime);
      } else {
        logout("inactive");
        return;
      }
    } else {
      resetTimeout();
    }

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTimeout();
      }
    };

    const handleStorage = (event) => {
      if (event.key === LAST_ACTIVITY_KEY && event.newValue && isAuthenticated) {
        const elapsed = Date.now() - Number(event.newValue);
        const remainingTime = TIMEOUT_DURATION - elapsed;

        if (remainingTime > 0) {
          scheduleTimeout(remainingTime);
        } else {
          logout("inactive");
        }
      }

      if ((event.key === "userToken" || event.key === "authToken") && !event.newValue) {
        clearSessionTimeout();
        dispatch(logoutAction());
        navigate("/", { replace: true });
      }
    };

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetTimeout, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", resetTimeout);
    window.addEventListener("storage", handleStorage);

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimeout);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", resetTimeout);
      window.removeEventListener("storage", handleStorage);
      clearSessionTimeout();
    };
  }, [
    checkInactivity,
    clearSessionTimeout,
    dispatch,
    isAuthenticated,
    logout,
    navigate,
    resetTimeout,
    scheduleTimeout,
  ]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isSessionActive: isAuthenticated && timeoutReason !== "inactive",
      sessionTimeoutMinutes: TIMEOUT_DURATION / 60000,
      timeoutReason,
      login,
      logout,
      resetTimeout,
    }),
    [isAuthenticated, login, logout, resetTimeout, timeoutReason],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
