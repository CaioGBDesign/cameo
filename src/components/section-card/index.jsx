import Button from "@/components/button";
import ArrowButton from "@/components/arrow-button";
import TextIcon from "@/components/icons/TextIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import styles from "./index.module.scss";

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
  scrollRef,
  children,
}) {
  const hasHeader =
    title || showListIcon || count || avatars || actions || verTodos || scrollRef;

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
                {showInfoIcon && (
                  <InfoIcon
                    size={24}
                    color={infoIconColor ?? "var(--text-base)"}
                  />
                )}
              </div>
            )}

            {count !== undefined && (
              <span className={styles.count}>{count}</span>
            )}

            {avatars && <div className={styles.avatars}>{avatars}</div>}
          </div>

          {(actions || verTodos || scrollRef) && (
            <div className={styles.buttons}>
              {scrollRef && <ArrowButton scrollRef={scrollRef} />}
              {actions &&
                actions.map((action, i) => (
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
