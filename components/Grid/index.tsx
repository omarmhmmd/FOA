import styles from "./grid.module.scss";
import { NextPage } from "next";
import Flag from "../Flag";
import { flags } from "../../public/flags.js";

interface Props {}

const Stack: NextPage<Props> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {flags.map((flag, index) => (
					// try wrapping this in a set width div for the Grid only
          <Flag
            key={index}
						image={`https://raw.githubusercontent.com/omarmhmmd/FOA/9d0d1a7a36a8e0d139dc6cfef2873a0a5b9aa26e/public/images/${index}.png`}
            duration={flag.duration}
            kingdom={flag.kingdom}
						year={flag.year}
						flagIndex={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Stack;
