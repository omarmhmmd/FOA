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
            style={
              activeFlag
                ? {
                    boxShadow:
                      "0px 0px 0px 0px rgb(0, 0, 0), rgb(204, 225, 255) 0px 0px 0px 16px, 0px 0px 0px 17px rgb(0, 0, 0)",
                  }
                : { boxShadow: "none" }
            }
            alt="Fragment of a flag in a list of other fragments"
          />
          <div className={styles.activeContainer}>
            <div className={styles.infoContainer}>
              <div>
                <SmallTextBox duration={props.duration} />
                {/* <SmallTextBox kingdom={props.kingdom} /> */}
              </div>
              <div
                style={activeFlag ? { display: "none" } : { display: "block" }}
              >
                <Link href="/flag/year">
                  <SmallTextBox type={"drag"} />
                </Link>
              </div>
            </div>
            <div
              className={styles.infoActive}
              style={activeFlag ? { display: "block" } : { display: "none" }}
            >
              <div className={styles.activeArrow}>
                <NorthEastIcon fontSize="small" htmlColor="black" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default FlagFragment;
