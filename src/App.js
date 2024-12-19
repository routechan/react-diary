import "./App.css";

import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Calender from "./Calender";
import Auth from "./Auth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Share from "./Share";

function App() {
  // 日付を保管するステート
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + today.getMonth() + 2).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  });

  // 日付のエラーを保管するステート
  const [dateBlankError, setDateBlankError] = useState(false);
  const onBlurDate = (event) => {
    if (!event.target.value) {
      setDateBlankError(true);
    }
  };

  // 保存完了時のアラートを出すためのステート
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // データベースに日記を追加する関数
  const addPost = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        setIsLoading(false);
        setErrorOpen(true);
        setTimeout(() => setErrorOpen(false), 3000);
        return;
      }

      if (!selectedDate) {
        setIsLoading(false);
        return;
      }
      const q = query(
        collection(db, "diary-data"),
        where("date", "==", selectedDate),
        where("userId", "==", userId)
      );
      const querySnap = await getDocs(q);

      // 既存データがあれば削除
      const deletePost = () => {
        querySnap.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "diary-data", docSnap.id));
        });
      };
      deletePost();

      // 日記に何も書かれていない状態で保存が推されたらその日付のデータを削除
      if (diary.trim()) {
        await addDoc(collection(db, "diary-data"), {
          post: diary,
          date: selectedDate,
          userId: userId,
        });
      } else {
        deletePost();
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
      setOpen(true);

      setTimeout(() => setOpen(false), 3000);
    } catch {
      setIsLoading(false);
      return;
    }
  };

  // 日付変更時の操作
  // ルーティングパスから日付だけを取得する
  const pathname = useLocation().pathname;
  const diaryDate = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const [diary, setDiary] = useState("");

  // pathnameが変更されたら関数を実行
  useEffect(() => {
    const getDiary = async () => {
      try {
        setDiary([]);
        // 必要に応じてpathnameを処理
        const sanitizedPathname = pathname.startsWith("/")
          ? pathname.slice(1)
          : pathname;

        const q = query(
          collection(db, "diary-data"),
          where("date", "==", sanitizedPathname),
          where("userId", "==", userId)
        );

        const querySnap = await getDocs(q);

        //  日記データが存在していれば日付とポストを取得
        if (!querySnap.empty) {
          const fetchedDiary = querySnap.docs[0].data();
          setDiary(fetchedDiary.post);
          setSelectedDate(fetchedDiary.date);
        }
        // 日記データがない場合はpostに空を保存
        else {
          setDiary("");
        }
        setSelectedDate(sanitizedPathname);
      } catch (error) {
        console.error("データの取得でエラー", error);
      }
    };

    getDiary();
  }, [pathname]);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // useridを取得
  let userId = "";
  const [user] = useAuthState(auth);
  if (user) {
    userId = auth.currentUser.uid;
  }
  return (
    <div className="App">
      <Auth />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
        <Snackbar open={open} autoHideDuration={3000} message="Note archived">
          <Alert severity="success" variant="filled">
            ナイスファイト！
          </Alert>
        </Snackbar>
        <Snackbar
          open={errorOpen}
          autoHideDuration={3000}
          message="Note archived"
        >
          <Alert severity="error" variant="filled">
            ログインしてね！
          </Alert>
        </Snackbar>
        <Calender />

        <Stack direction="column" spacing={2} mt={2}>
          <label htmlFor="date">日付</label>
          <TextField
            id="date"
            type="date"
            label="日付"
            value={diaryDate ? diaryDate : selectedDate}
            onChange={(event) => {
              if (event.target.value) {
                setDateBlankError(false);
              }
              setSelectedDate(event.target.value);
              const changedDate = event.target.value;
              navigate(`/${changedDate}`);
            }}
            inputProps={{ maxLength: 4 }}
            onBlur={onBlurDate}
            error={dateBlankError}
            sx={{ marginTop: 4 }}
          />
          <label htmlFor="diary">今日頑張ったこと</label>
          <TextField
            id="diary"
            multiline
            rows={4}
            value={diary}
            onChange={(event) => {
              setDiary(event.target.value);
            }}
          />

          <Button variant="contained" onClick={addPost} disabled={isLoading}>
            {isLoading ? <CircularProgress sx={{ fontSize: "16" }} /> : "保存"}
          </Button>
        </Stack>
      </Stack>
      <Share selectedDate={selectedDate} />
    </div>
  );
}

export default App;
