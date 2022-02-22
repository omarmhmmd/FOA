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
            image={`/images/flags-sml/${index}.jpg`}
            duration={flag.duration}
            kingdom={flag.kingdom}
						year={flag.year}
						flagIndex={index}
          />
      ))}
    </div>
  );
};

export default Stack;
