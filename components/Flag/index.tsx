import styles from "./flag.module.scss";
import Image from "next/image";
import SmallTextBox from "../SmallTextBox";
import { NextPage } from "next";
import React, { useState } from "react";

interface Props {
  image: string;
  duration: string;
  kingdom: string;
}

const FlagFragment: NextPage<Props> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <img
          src={props.image}
          alt="Fragment of a flag in a list of other fragments"
        />
				<div className={styles.infoContainer}>
					<div>
						<SmallTextBox duration={props.duration} />
						{/* <SmallTextBox kingdom={props.kingdom} /> */}
					</div>
					<div>
						<SmallTextBox type={"drag"} />
					</div>
        </div>
      </div>
    </>
  );
};

export default FlagFragment;
