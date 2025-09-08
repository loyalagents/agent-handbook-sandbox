import React from "react";
import styles from "./styles.module.css";

type PillProps = {
	children: React.ReactNode;
	type: "info" | "success" | "warning" | "danger";
};

const Pill: React.FC<PillProps> = ({ children, type }) => {
	return <div className={`${styles["pill"]} ${styles[type]}`}>{children}</div>;
};

export default Pill;
