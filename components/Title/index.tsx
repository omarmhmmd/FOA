import type { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./title.module.scss";


const Title: NextPage = () => {

  return (
		<Link href="/">
      <div className={styles.container}>
        <h3>
          بيرق هاى افغانستان
          <br />
          <span className={styles.helvetica}>Flags Of Afghanistan</span>
        </h3>
			</div>
		</Link>	

  );
};

export default Title;
