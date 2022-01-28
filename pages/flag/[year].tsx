import type { NextPage } from "next";
import React, { useState } from "react";
import styles from "./flag.module.scss";
import Title from "../../components/Title";
import MUIGrud from "@mui/material/Grid";
import Flag from "../../components/Flag";
import { flags } from "../../public/flags.js";

const Index: NextPage = () => {
  return (
    <MUIGrud className={styles.container} container spacing={0}>
      <MUIGrud item className={styles.listContainer} sm={2} display={{ xs: "none", sm: "block" }}>
        <div className={styles.title}>
          <Title/>
        </div>
        <div className={styles.list}>
          {flags.map((flag, index) => (
            <div className={styles.listItem}>
              <Flag
                key={index}
                // image={`https://raw.githubusercontent.com/omarmhmmd/FOA/main/public/images/${index}.png`}
                image={`https://raw.githubusercontent.com/omarmhmmd/FOA/9d0d1a7a36a8e0d139dc6cfef2873a0a5b9aa26e/public/images/${index}.png`}
                duration={flag.duration}
                kingdom={flag.kingdom}
              />
            </div>
          ))}
        </div>
      </MUIGrud>
      <MUIGrud item sm={6} display={{ xs: "none", sm: "block" }}>
        <div>xs=6</div>
      </MUIGrud>
      <MUIGrud item xs={12} sm={3}>
        <div>xs=8</div>
      </MUIGrud>
    </MUIGrud>
  );
};

export default Index;
