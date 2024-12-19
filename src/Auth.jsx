import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button } from "@mui/material";

const Auth = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <div>
      {user ? (
        <>
          {/* <UserInfo /> */}
          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

// サインイン
function SignInButton() {
  const [disabled, setDisabled] = useState(false);
  const signInWithGoogle = async () => {
    setDisabled(true);
    try {
      await signInWithPopup(auth, provider); // 非同期処理を待機
    } catch (error) {
      console.error("Sign-in error:", error);
    }
    setDisabled(false);
  };
  return (
    <Button variant="outlined" onClick={signInWithGoogle} disabled={disabled}>
      サインイン
    </Button>
  );
}

// サインアウト
function SignOutButton() {
  const [disabled, setDisabled] = useState(false);
  const signOut = async () => {
    setDisabled(true);
    try {
      await auth.signOut(); // 非同期処理を待機
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };
  return (
    <Button variant="outlined" onClick={signOut} disabled={disabled}>
      サインアウト
    </Button>
  );
}

// ユーザー情報
function UserInfo() {
  if (!auth.currentUser) {
    return null; // ユーザーが存在しない場合は何も表示しない
  }
  return (
    <>
      <img
        className="userIcon"
        src={auth.currentUser.photoURL}
        alt="userアイコン"
      />
    </>
  );
}

export default Auth;
