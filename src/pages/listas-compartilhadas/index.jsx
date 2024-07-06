import React, { useState } from "react";
import styles from "./index.module.scss";
import Header from "@/components/Header";

const Login = () => {
  return (
    <main className={styles["background"]}>
      <Header />

      <div className={styles.login}></div>
    </main>
  );
};

export default Login;
