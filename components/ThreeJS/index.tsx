import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { NextPage } from "next";
import * as THREE from "three";
import styles from "./threeJS.module.scss";

interface Props {
  meshIndex: number;
}

const ThreeJS: NextPage<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="canonical" href="http://mysite.com/example" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r67/three.min.js"></script>
        <script src="Cloth.js"></script>
      </Helmet>
      {props.meshIndex}
    </div>
  );
};

export default ThreeJS;
