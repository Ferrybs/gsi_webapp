"use client";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import pt from "./locales/pt.json";
import en from "./locales/en.json";
import { ReactNode, useEffect } from "react";

i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en } },
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
});

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
