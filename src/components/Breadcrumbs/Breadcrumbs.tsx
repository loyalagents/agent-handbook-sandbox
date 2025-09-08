import * as React from "react";

import Link from "next/link";
import styles from "./styles.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  hideCurrent?: boolean;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, hideCurrent = true }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={styles["breadcrumbs"]}>
      <ol className={styles["breadcrumb-list"]}>
        {items.map((item, index) => (
          <li key={index} className={styles["breadcrumb-item"]}>
            {item.isCurrent ? (
              <span 
                className={styles["current-item"] + (hideCurrent ? " " + styles["hide-current-item"] : "")}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link href={item.href} className={styles["breadcrumb-link"]}>
                {item.label}
              </Link>
            ) : (
              <span className={styles["breadcrumb-text"]}>{item.label}</span>
            )}
            
            {index < items.length - 1 && (
              <span className={styles["separator"]} aria-hidden="true">
                &gt;
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
