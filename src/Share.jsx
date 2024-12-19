import "./App.css";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "./firebase";

const Share = ({ selectedDate }) => {
  // ステートで取得したデータを管理
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Firestore クエリの実行
        const q = query(
          collection(db, "diary-data"),
          where("date", "==", selectedDate),
          limit(5)
        );
        const querySnapshot = await getDocs(q);

        // データを配列に変換
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data().post);
        });

        // ステートを更新
        setFetchedPosts(posts);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    // `selectedDate` が変更されるたびにデータを取得
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  // ローディング中
  if (loading) {
    return <p>データを読み込み中...</p>;
  }

  // エラーが発生した場合
  if (error) {
    return <p>{error}</p>;
  }

  // データを表示
  return (
    <div>
      <h3>{selectedDate} のみんなが頑張ったこと</h3>
      {fetchedPosts.length > 0 ? (
        <ul>
          {fetchedPosts.map((post, index) => (
            <li key={index}>{post}</li>
          ))}
        </ul>
      ) : (
        <p>投稿がありません。</p>
      )}
    </div>
  );
};

export default Share;
