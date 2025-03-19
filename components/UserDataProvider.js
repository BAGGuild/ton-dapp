"use client";

import React, { useEffect } from "react";
import { init, isTMA, viewport, miniApp } from "@telegram-apps/sdk-react";
import { fetchUserData } from "@/utils/apiClient"; 
import { useUser } from "@/context/UserContext";

export default function UserDataProvider({ children, setLoading }) {
  const { setUserData } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isTMA()) {
          init();

          if (viewport.expand.isAvailable()) {
            viewport.expand();
          }

          if (miniApp.mount.isAvailable()) {
            miniApp.mount();
            miniApp.setHeaderColor('#000000');
            miniApp.setBackgroundColor('#000000');
            miniApp.setBottomBarColor('#000000');
          }
          
          const userResponse = await fetchUserData();
          setUserData(userResponse);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setUserData, setLoading]);

  return <>{children}</>;
}