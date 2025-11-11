import { useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeContext";

export default function useDarkMode() {
  return useContext(DarkModeContext);
}
