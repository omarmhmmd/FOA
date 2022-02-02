import styles from "./flagFragment.module.scss";
import Image from "next/image";
import Link from "next/link";
import SmallTextBox from "../../SmallTextBox";
import { NextPage } from "next";
import React, { useState } from "react";

interface Props {
  image: string;
  duration: string;
  kingdom: string;
	year: number;
	flagIndex: number;
}

const FlagFragment: NextPage<Props> = (props) => {
  return (
    <>
      <Link href={`/flag/${props.flagIndex+1}/year/${props.year}`}>
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
              <SmallTextBox duration={props.duration} />
              <SmallTextBox kingdom={props.kingdom} />
            </div>
            <div>
              <Link href={`/flag/${props.year}`}>
                <SmallTextBox type={"drag"} />
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default FlagFragment;
