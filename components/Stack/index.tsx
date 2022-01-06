import styles from "./stack.module.scss";
import { NextPage } from "next";
import FlagFragment from "../FlagFragment";

interface Props {}

const Stack: NextPage<Props> = () => {
  return (
    <>
			<FlagFragment
				image={`/images/2.png`}
				year="1901-19"
				era="Emirate of Afghanistan"
			/>
			<FlagFragment
				image={`/images/2.png`}
				year="1901-19"
				era="Emirate of Afghanistan"
			/>
			<FlagFragment
				image={`/images/2.png`}
				year="1901-19"
				era="Emirate of Afghanistan"
			/>
		</>
		
  );
};

export default Stack;
