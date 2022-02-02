import type { NextPage } from "next";
import React, { useState } from "react";
import styles from "./data.module.scss";

interface Props {
  year: number;
  duration: string;
  ruler: string;
  kingdom: string;
}

const Data: NextPage<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.dataContainer}>
          <h1>Year</h1>
          <p>{props.year}</p>
        </div>
        <div className={styles.dataContainer}>
          <h1>Government</h1>
          <p>{props.kingdom}</p>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.dataContainer}>
          <h1>Ruler</h1>
          <p>{props.ruler}</p>
        </div>
        <div className={styles.dataContainer}>
          <h1>Duration</h1>
          <p>{props.duration}</p>
        </div>
      </div>
    </div>
  );
};

export default Data;
