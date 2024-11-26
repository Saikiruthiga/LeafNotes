"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { makeRequest } from "../utils/makeRequest";
import { useAuth } from "./AuthContext";
import { useBookshelf } from "./BooksReadCountContext";

const GoalContext = createContext();
export const useGoal = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeGoal, setActiveGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bookShelf } = useBookshelf();

  useEffect(() => {
    if (!currentUser) return;

    const fetchGoal = async () => {
      try {
        const response = await makeRequest(`/api/goals/latest`, {}, "GET");
        console.log("Raw API response:", response);

        if (response && response.goal) {
          setActiveGoal(response.goal);
        } else {
          console.log("No active goal found. Showing goal modal.");
          setActiveGoal(null);
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
        // Log additional error information
        if (error.response) {
          console.error("API Response Error:", error.response);
        } else if (error.request) {
          console.error("API Request Error:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
        setActiveGoal(null);
      }
    };

    fetchGoal();
  }, [currentUser]);

  const setGoal = async (goalData) => {
    setIsSubmitting(true);

    try {
      if (activeGoal) {
        return updateGoal(goalData);
      }

      const startDate = new Date(goalData.start_date || new Date());
      let endDate;

      if (goalData.goal_type === "MONTHLY") {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (goalData.goal_type === "ANNUAL") {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const newGoal = await makeRequest("/api/goals/add", {
        ...goalData,
        end_date: endDate.toISOString().split("T")[0],
      });

      setActiveGoal(newGoal.goal);
    } catch (error) {
      console.error("Failed to set goal:", error);
      // Log additional error information
      if (error.response) {
        console.error("API Response Error:", error.response);
      } else if (error.request) {
        console.error("API Request Error:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGoal = async (goalData) => {
    setIsSubmitting(true);

    try {
      const updatedData = { ...goalData };

      if (goalData.start_date || goalData.goal_type) {
        const startDate = new Date(
          goalData.start_date || activeGoal.start_date || new Date()
        );
        let endDate;

        if (goalData.goal_type || activeGoal.goal_type === "MONTHLY") {
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (goalData.goal_type || activeGoal.goal_type === "ANNUAL") {
          endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        updatedData.end_date = endDate.toISOString().split("T")[0];
      }

      const updatedGoal = await makeRequest(
        `/api/goals/${activeGoal.goal_id}`,
        updatedData,
        "PUT"
      );

      setActiveGoal(updatedGoal.goal);
    } catch (error) {
      console.error("Failed to update goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await makeRequest(`/api/goals/${goalId}`, {}, "DELETE");
      setActiveGoal(null);
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const getProgress = () => {
    if (!activeGoal || !activeGoal.goal_count) return 0;
    const startDate = activeGoal.start_date
      ? new Date(activeGoal.start_date)
      : new Date();
    const booksAfterStartDate = bookShelf.read.filter(
      (book) => new Date(book.created_at) >= new Date(activeGoal.start_date)
    );

    return Math.min(
      (booksAfterStartDate.length / activeGoal.goal_count) * 100,
      100
    );
  };

  const getTimeRemaining = () => {
    if (!activeGoal) return null;

    const today = new Date();
    const endDate = new Date(activeGoal.end_date);

    if (activeGoal.goal_type === "MONTHLY") {
      const daysLeft = Math.max(
        Math.floor((endDate - today) / (1000 * 60 * 60 * 24)),
        0
      );
      return daysLeft > 0 ? `${daysLeft} day(s) left` : "Goal time elapsed!";
    } else if (activeGoal.goal_type === "ANNUAL") {
      const monthsLeft = Math.max(
        Math.floor((endDate - today) / (1000 * 60 * 60 * 24 * 30)),
        0
      );
      return monthsLeft > 0
        ? `${monthsLeft} month(s) left`
        : "Goal time elapsed!";
    }

    return null;
  };
  return (
    <GoalContext.Provider
      value={{
        activeGoal,
        setGoal,
        updateGoal,
        deleteGoal,
        getProgress,
        getTimeRemaining,
        isSubmitting,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
