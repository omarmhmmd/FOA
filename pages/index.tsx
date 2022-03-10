import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "./home.module.scss";
import Stack from "../components/Stack";
import TableRowsIcon from "@mui/icons-material/TableRows";
import Grid from "../components/Grid";
import MUIGrud from "@mui/material/Grid";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import Fade from "@mui/material/Fade";
import Title from "../components/Title";
import { useRouter } from "next/router";
import Head from 'next/head'

const Index: NextPage = () => {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();

  const push = () => {
    // switch(toggle) {
    // 	case toggle:
    // 		router.push('/table', undefined, { shallow: true })
    // 	default:
    // 		router.push('/', undefined, { shallow: true })
    // }
  };

	useEffect(() => {
    router.prefetch('/flag/[flagIndex]/year/[year]')
  }, [])

  return (
    <div className={styles.container}>
			<Head>
        <title>بيرق هاى افغانستان | Flags Of Afghanistan</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.clickContainer}>
        <div className={styles.title}>
          <Title farsi="بيرق هاى افغانستان" english="Flags Of Afghanistan" />
        </div>
        {toggle && (
          <div
            className={styles.click}
            onClick={() => {
              setToggle(false);
              push();
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
              push();
            }}
          >
            <ViewComfyIcon fontSize="small" htmlColor="black" />
          </div>
        )}
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
