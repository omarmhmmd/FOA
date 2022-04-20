import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "./home.module.scss";
import Stack from "../components/Stack";
import TableRowsIcon from "@mui/icons-material/TableRows";
import Grid from "../components/Grid";
import MUIGrud from "@mui/material/Grid";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import InfoIcon from "@mui/icons-material/Info";
import Fade from "@mui/material/Fade";
import Title from "../components/Title";
import { useRouter } from "next/router";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

const Index: NextPage = () => {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/flag/[flagIndex]/year/[year]");
  }, []);

  return (
    <div className={styles.container}>
      <NextNProgress
        color="#009900"
        startPosition={0}
        stopDelayMs={200}
        height={7.5}
      />
      <Head>
        <title>بيرق هاى افغانستان | Flags Of Afghanistan</title>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
      </Head>
      <div className={styles.clickContainer}>
        <div className={styles.title}>
          <Title farsi="بيرق هاى افغانستان" english="Flags Of Afghanistan" />
        </div>
        <div className={styles.iconsContainer}>
          {toggle && (
            <div
              className={styles.click}
              onClick={() => {
                setToggle(false);
              }}
            >
              <TableRowsIcon fontSize="small" htmlColor="black" />
            </div>
          )}
          {!toggle && (
            <div
              className={styles.click}
              onClick={() => {
                setToggle(true);
              }}
            >
              <ViewComfyIcon fontSize="small" htmlColor="black" />
            </div>
          )}
          <a target="_blank" href="https://omarmhmmd.notion.site/Flags-Of-Afghanistan-dcfe7bd17ed140bc846557b6856ac9ea">
            <div className={styles.click}>
              <InfoIcon fontSize="small" htmlColor="black" />
            </div>
          </a>
        </div>
      </div>

      <div>
        {!toggle && (
          <Fade timeout={1500} in={!toggle}>
            <span>
              <Stack />
            </span>
          </Fade>
        )}
        {toggle && (
          <Fade timeout={1500} in={toggle}>
            <span>
              <Grid />
            </span>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default Index;
