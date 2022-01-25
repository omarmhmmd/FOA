import styles from "./stack.module.scss";
import { NextPage } from "next";
import FlagFragment from "./FlagFragment";
import {flags} from "../../public/flags.js"

interface Props {}

const Stack: NextPage<Props> = () => {
  return (
    <div className={styles.list}>
      {flags.map((flag, index) => (
        <FlagFragment
					key={index}
          image={`https://raw.githubusercontent.com/omarmhmmd/FOA/main/public/images/${index}.png`}
          duration={flag.duration}
          kingdom={flag.kingdom}
        />
      ))}
			
    </div>
  );
};

export default Stack;
