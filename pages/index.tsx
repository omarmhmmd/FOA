import type { NextPage } from "next";
import styles from "./home.module.scss";
import Stack from "../components/Stack";

const Index: NextPage = () => {

  return (
		<div className={styles.container}> 
				<Stack/>
		</div>
	);  	
};

export default Index;
