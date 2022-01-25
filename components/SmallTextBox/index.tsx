import styles from "./smallTextBox.module.scss";
import { NextPage } from "next";
import NorthEastIcon from "@mui/icons-material/NorthEast";


interface Props {
  duration?: string;
  kingdom?: string;
  type?: string;
}

const SmallTextBox: NextPage<Props> = (props) => {
  return (
    <div className={styles.container}>
			<div className={styles.text}>
				<p>{props.duration}</p>
				<p>{props.kingdom}</p>
			</div>
      {props.type && (
        <div className={styles.click}>
          <NorthEastIcon fontSize="small" htmlColor="black" />
        </div>
      )}
    </div>
  );
};

export default SmallTextBox;
