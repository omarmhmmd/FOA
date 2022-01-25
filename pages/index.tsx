import type { NextPage } from "next";
import React, { useState } from "react";
import styles from "./home.module.scss";
import Stack from "../components/Stack";
import TableRowsIcon from "@mui/icons-material/TableRows";
import Grid from "../components/Grid";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";

import Fade from "@mui/material/Fade";

const Index: NextPage = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.clickContainer}>
        <h3>
          بيرق هاى افغانستان
          <br />
          <span className={styles.helvetica}>Flags Of Afghanistan</span>
        </h3>
        {toggle && (
          <div className={styles.click} onClick={() => setToggle(false)}>
            <TableRowsIcon fontSize="small" htmlColor="black" />
          </div>
        )}
        {!toggle && (
          <div className={styles.click} onClick={() => setToggle(true)}>
            <ViewComfyIcon fontSize="small" htmlColor="black" />
          </div>
        )}
      </div>

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
  );
};

export default Index;
