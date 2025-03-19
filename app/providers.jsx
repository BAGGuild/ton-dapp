'use client'

import { useState } from 'react'
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import UserDataProvider from "@/components/UserDataProvider";
import { UserProvider } from "@/context/UserContext";

export function Providers({ children }) {
  const [loading, setLoading] = useState(true);

  return (
    <HeroUIProvider>
      <UserProvider>
        <UserDataProvider setLoading={setLoading}>
            <ToastProvider 
            placement='top-center' 
            toastProps={{
                  color: "primary",
                  timeout: 2000,
                  shouldShowTimeoutProgress: true,
                  severity: "success",
                  hideCloseButton: true,
              }}
            />
            {loading ? (
                <div className="flex h-screen items-center justify-center ">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
            ) : (
                children
            )}
        </UserDataProvider>
      </UserProvider>
    </HeroUIProvider>
  )
}