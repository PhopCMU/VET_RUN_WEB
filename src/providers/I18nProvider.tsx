import React from "react";
import { useI18nReady } from "../i18n";
import Loading from "../components/Loading";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const isI18nReady = useI18nReady();

  if (!isI18nReady) {
    return <Loading />;
  }

  return <div>{children}</div>;
};
