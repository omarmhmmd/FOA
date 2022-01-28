import styles from "./flag.module.scss";
import Image from "next/image";
import Link from "next/link";
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
      <Link href="/flag/year">
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
              <Link href="/flag/year">
                <SmallTextBox type={"drag"} />
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default FlagFragment;
