import type { NextPage } from "next";
import {useRouter} from 'next/router'
import React, { useState } from "react";
import styles from "./flag.module.scss";
import Title from "../../../../components/Title";
import MUIGrid from "@mui/material/Grid";
import Flag from "../../../../components/Flag";
import { flags } from "../../../../public/flags.js";
import Data from "../../../../components/Data";
import ThreeJS from "../../../../components/ThreeJS";

const Index: NextPage = () => {

	const router = useRouter();
	const {flagIndex,year} = router.query;
	
	const flagIndexNum = parseInt(flagIndex as string, 10)
	
	const checkFlag = () => {
		return flagIndexNum-1
	}
  return (
    <MUIGrid className={styles.container} container spacing={0}>
      <MUIGrid
        item
        className={styles.listContainer}
        sm={1.5}
        display={{ xs: "none", sm: "block" }}
      >
        <div className={styles.title}>
          <Title farsi="بيرق هاى افغانستان" english="Flags Of Afghanistan" />
        </div>
        <div className={styles.list}>
          {flags.map((flag, index) => (
            <div className={styles.listItem}>
              <Flag
                key={index}
                image={`https://raw.githubusercontent.com/omarmhmmd/FOA/9d0d1a7a36a8e0d139dc6cfef2873a0a5b9aa26e/public/images/${index}.png`}
                duration={flag.duration}
                kingdom={flag.kingdom}
								year={flag.year}
								flagIndex={index}
              />
            </div>
          ))}
        </div>
      </MUIGrid>
      <MUIGrid className={styles.threeJSContainer}>
        <ThreeJS meshIndex={checkFlag()} />
      </MUIGrid>
      <MUIGrid item xs={12} sm={3} className={styles.infoContainer}>
        <div className={styles.title}>
          <Title
            farsi="جمهوری دمکراتی افغانستان"
            english={flags[checkFlag()].kingdom}
          />
        </div>
        <div className={styles.infoList}>
          <div className={styles.infoFlag}>
            <img
              src={
                `https://raw.githubusercontent.com/omarmhmmd/FOA/9d0d1a7a36a8e0d139dc6cfef2873a0a5b9aa26e/public/images/${checkFlag()}.png`
              }
              alt="Flag"
            />
          </div>
          <div className={styles.infoData}>
            <Data
              duration={flags[checkFlag()].duration}
              kingdom={flags[checkFlag()].kingdom}
              ruler={flags[checkFlag()].ruler}
              year={flags[checkFlag()].year}
            />
          </div>
          <div className={styles.infoEssay}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </div>
      </MUIGrid>
    </MUIGrid>
  );
};

export default Index;
