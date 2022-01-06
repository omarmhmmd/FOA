import styles from "./flagFragment.module.scss";
import Image from "next/image";
import SmallTextBox from "../SmallTextBox";
import { NextPage } from "next";

interface Props {
  image: string;
	year: string;
  era: string;
}

const FlagFragment: NextPage<Props> = (props) => {
	console.log(props)
  return (
    <>
      <div className={styles.container}>
        <Image
          src={props.image}
          className={styles.image}
          layout="fill"
          objectFit="cover"
          alt="Fragment of a flag in a list of other fragments"
        />
        <div className={styles.infoContainer}>
					<div>
						<SmallTextBox year={props.year} />
						<SmallTextBox era={props.era} />
					</div>
					<div>
						<SmallTextBox type={"drag"} />
					</div>
        </div>
      </div>
    </>
  );
};

export default FlagFragment;
