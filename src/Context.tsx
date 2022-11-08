/**
 * External Dependencies
 */
import { createContext, useContext } from "preact/compat";

/**
 * Internal Dependencies
 */
import { IAppContext } from "./models/interface";

// Create ContextAPI wrapping the global state
export const WidgetContext = createContext<IAppContext>({
  isLoading: false,     // OPWidget loading status
  insuranceData: null   // Store information
});

export const useWidgetContext = () => useContext(WidgetContext);