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
            image={`https://raw.githubusercontent.com/omarmhmmd/FOA/main/public/images/${index}.png`}
            duration={flag.duration}
            kingdom={flag.kingdom}
            // image={`https://raw.githubusercontent.com/omarmhmmd/FOA/main/public/images/14.png`}
            // duration={"1901"}
            // kingdom={"Afghan"}
          />
        ))}
      </div>
    </div>
  );
};

export default Stack;
