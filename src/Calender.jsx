import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calender = () => {
  const [events, setEvents] = useState([]); // イベントを管理する状態

  // useridを取得
  let userId = "";
  const [user] = useAuthState(auth);
  if (user) {
    userId = auth.currentUser.uid;
  }

  const getDate = async () => {
    try {
      const q = query(
        collection(db, "diary-data"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedDates = [];

      querySnapshot.forEach((doc) => {
        fetchedDates.push(doc.data().date); // Firestore から日付を取得
      });

      // イベントデータを生成
      const generatedEvents = fetchedDates.map((date) => ({
        start: date,
        display: "background",
        color: "#1976d2",
      }));

      setEvents(generatedEvents); // 状態を更新
    } catch (error) {
      console.error("Error fetching diary data:", error);
    }
  };
  if (user) {
    getDate();
  }
  useEffect(() => {
    getDate();
  }, [user]);

  const navigate = useNavigate();

  const handleDateClick = (arg) => {
    const selectedDate = arg.dateStr;
    navigate(`/${selectedDate}`); // クリックした日付に基づいてページ遷移
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
      />
    </div>
  );
};

export default Calender;
