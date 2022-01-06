import styles from "./smallTextBox.module.scss";
import { NextPage } from "next";
import Button from "@mui/material/Button";
import DragIndicatorSharpIcon from "@mui/icons-material/DragIndicatorSharp";

interface Props {
  year?: string;
  era?: string;
  type?: string;
}

const SmallTextBox: NextPage<Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.year && <p className={styles.year}>{props.year}</p>}
      {props.type && (
        <div className={styles.drag}>
          <DragIndicatorSharpIcon color="inherit" />
        </div>
      )}
      <p>{props.era}</p>
    </div>
  );
};

export default SmallTextBox;
