import styles from "./stack.module.scss";
import { NextPage } from "next";
import Link from 'next/link'
import FlagFragment from "./FlagFragment";
import { flags } from "../../public/flags.js";

interface Props {}

const Stack: NextPage<Props> = () => {
  return (
    <div className={styles.list}>
      {flags.map((flag, index) => (
          <FlagFragment
            key={index}
            // image={`https://raw.githubusercontent.com/omarmhmmd/FOA/main/public/images/${index}.png`}
            image={`https://raw.githubusercontent.com/omarmhmmd/FOA/9d0d1a7a36a8e0d139dc6cfef2873a0a5b9aa26e/public/images/${index}.png`}
            duration={flag.duration}
            kingdom={flag.kingdom}
          />
      ))}
    </div>
  );
};

export default Stack;
