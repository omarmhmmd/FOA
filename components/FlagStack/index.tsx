import styles from "./flag.module.scss";
import Image from "next/image";
import Link from "next/link";
import SmallTextBox from "../SmallTextBox";
import { NextPage } from "next";
import React, { useState } from "react";
import NorthEastIcon from "@mui/icons-material/ArrowForward";

interface Props {
  image: string;
  duration: string;
  kingdom: string;
  year: number;
  flagIndex: number;
  currentFlag: number;
}

const FlagFragment: NextPage<Props> = (props) => {
  let activeFlag = false;
  if (props.currentFlag == props.flagIndex) {
    console.log(props.currentFlag, props.flagIndex, "match!");
    activeFlag = true;
  }

  return (
    <>
      <Link
        href={{
          pathname: `/flag/[flagIndex]/year/[year]`,
          query: { flagIndex: props.flagIndex + 1, year: props.year },
        }}
      >
        <div className={styles.container}>
          <img
            src={props.image}
            alt="Fragment of a flag in a list of other fragments"
          />
          <div className={styles.activeContainer}>
            <div className={styles.infoContainer}>
              <div>
                <SmallTextBox duration={props.duration} />
                {/* <SmallTextBox kingdom={props.kingdom} /> */}
              </div>
              <div
              >
                <Link href="/flag/year">
                  <SmallTextBox type={"drag"} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default FlagFragment;
