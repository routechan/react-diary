import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "./firebase";

const Preview = () => {
  const pathname = useLocation().pathname;
  const [diaries, setDiaries] = useState([]); // Firestoreから取得したデータを保持するstate

  useEffect(() => {
    const getDiary = async () => {
      try {
        // 必要に応じてpathnameを処理
        const sanitizedPathname = pathname.startsWith("/")
          ? pathname.slice(1)
          : pathname;

        const q = query(
          collection(db, "diary-data"),
          where("date", "==", sanitizedPathname)
        );
        const querySnapshot = await getDocs(q);

        // Firestoreのデータを配列に変換してstateに保存
        const fetchedDiaries = querySnapshot.docs.map((doc) => doc.data());
        setDiaries(fetchedDiaries); // stateを更新
      } catch (error) {
        console.error("Error fetching diary data:", error);
      }
    };

    getDiary();
  }, [pathname]); // pathnameの変更を監視

  return (
    <div>
      {diaries.length > 0 ? (
        diaries.map((diary, index) => (
          <div key={index}>
            <p>{diary.date}</p>
            <p>{diary.post}</p>
          </div>
        ))
      ) : (
        <p>No entries found.</p>
      )}
    </div>
  );
};

export default Preview;
