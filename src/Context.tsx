import { createContext, useContext } from "preact/compat";

export type IAppContext = {
  isLoading: boolean
};

export const WidgetContext = createContext<IAppContext>({
  isLoading: false
});

export const useWidgetContext = () => useContext(WidgetContext);