import { useState } from "react";
import AdmPrivate from "@/components/AdmPrivate";
import AdmSidebar from "@/components/adm/sidebar";
import AdmHeader from "@/components/adm/header";
import styles from "./index.module.scss";

export default function AdmLayout({ children, headerActions, breadcrumb, rightSidebar }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdmPrivate>
      <div
        className={styles.layout}
        style={{ "--right-sidebar-width": rightSidebar ? "30vw" : "0px" }}
      >
        <AdmSidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ""}`}>
          <AdmHeader actions={headerActions} collapsed={collapsed} breadcrumb={breadcrumb} />
          <main className={styles.content}>{children}</main>
        </div>
        {rightSidebar && (
          <aside className={styles.rightSidebar}>
            {rightSidebar}
          </aside>
        )}
      </div>
    </AdmPrivate>
  );
}
