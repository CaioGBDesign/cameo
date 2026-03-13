import Button from "@/components/button";
import TextIcon from "@/components/icons/TextIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import styles from "./index.module.scss";

// actions: array de { label?, icon?, onClick?, href?, border? }
// verTodos: { label?, onClick?, href? } — ghost com cor --text-header
// Apenas um dos dois (actions ou verTodos) deve ser passado por vez.

export default function SectionCard({
  title,
  showListIcon = false,
  showInfoIcon = false,
  listIconColor,
  infoIconColor,
  count,
  avatars,
  actions,
  verTodos,
  children,
}) {
  const hasHeader = title || showListIcon || count || avatars || actions || verTodos;

  return (
    <div className={styles.sectionCard}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.info}>
            {showListIcon && (
              <TextIcon size={24} color={listIconColor ?? "var(--text-base)"} />
            )}

            {title && (
              <div className={styles.titleGroup}>
                <span className={styles.title}>{title}</span>
                {showInfoIcon && <InfoIcon size={24} color={infoIconColor ?? "var(--text-base)"} />}
              </div>
            )}

            {count !== undefined && (
              <span className={styles.count}>{count}</span>
            )}

            {avatars && (
              <div className={styles.avatars}>{avatars}</div>
            )}
          </div>

          {(actions || verTodos) && (
            <div className={styles.buttons}>
              {actions && actions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  label={action.label}
                  icon={action.icon}
                  onClick={action.onClick}
                  href={action.href}
                  border={i === 0 ? "var(--stroke-base)" : undefined}
                />
              ))}

              {verTodos && (
                <Button
                  variant="ghost"
                  label={verTodos.label ?? "Ver todos"}
                  onClick={verTodos.onClick}
                  href={verTodos.href}
                  color="var(--text-header)"
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
