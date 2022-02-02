import type { NextPage } from "next";
import React, { useState } from "react";
import styles from "./threeJS.module.scss";

interface Props {
  meshIndex: number
}

const ThreeJS: NextPage<Props> = (props) => {
  return (
   <div className={styles.container}>
		 {props.meshIndex}
	 </div>
  );
};

export default ThreeJS;
