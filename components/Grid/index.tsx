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
          <Flag
            currentFlag={index}
            key={index}
						image={`/images/flags-sml/${index}.jpg`}
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
