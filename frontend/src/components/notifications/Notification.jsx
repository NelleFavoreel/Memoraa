// src/components/NotificationProvider.jsx
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import React from "react";

export default function NotificationProvider({ children }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        className="notification-container"
        toastOptions={{
          className: ({ type }) => `notification-toast ${type === "success" ? "success" : "error"}`,
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
