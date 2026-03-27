import { useState } from "react";
import AdmPrivate from "@/components/AdmPrivate";
import AdmSidebar from "@/components/adm/sidebar";
import AdmHeader from "@/components/adm/header";
import styles from "./index.module.scss";

export default function AdmLayout({ children, headerActions, breadcrumb }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdmPrivate>
      <div className={styles.layout}>
        <AdmSidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ""}`}>
          <AdmHeader actions={headerActions} collapsed={collapsed} breadcrumb={breadcrumb} />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </AdmPrivate>
  );
}
