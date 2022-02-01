import type { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./title.module.scss";

interface Props {
  farsi: string;
  english: string;
}

const Title: NextPage<Props> = (props) => {
  return (
    <Link href="/">
      <div className={styles.container}>
        <h3>
          {props.farsi}
          <br />
          <span className={styles.helvetica}> {props.english}</span>
        </h3>
      </div>
    </Link>
  );
};

export default Title;
