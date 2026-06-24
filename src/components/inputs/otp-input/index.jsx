import { useRef, useCallback } from "react";
import styles from "./index.module.scss";

const OTP_LENGTH = 6;

const OtpInput = ({ value = "", onChange, onComplete, disabled = false, error = false }) => {
  const inputsRef = useRef([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const focusAt = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const updateValue = useCallback(
    (newDigits) => {
      const code = newDigits.join("");
      onChange?.(code);
      if (code.length === OTP_LENGTH) onComplete?.(code);
    },
    [onChange, onComplete],
  );

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = "";
        updateValue(newDigits);
      } else if (index > 0) {
        newDigits[index - 1] = "";
        updateValue(newDigits);
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusAt(index + 1);
    }
  };

  const handleInput = (e, index) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;

    const newDigits = [...digits];
    newDigits[index] = raw[raw.length - 1];
    updateValue(newDigits);

    if (index < OTP_LENGTH - 1) focusAt(index + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newDigits = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    updateValue(newDigits);

    const nextEmpty = newDigits.findIndex((d) => !d);
    focusAt(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty);
  };

  return (
    <div className={`${styles.container} ${error ? styles.hasError : ""}`} aria-label="Código de verificação">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          disabled={disabled}
          aria-label={`Dígito ${i + 1} de ${OTP_LENGTH}`}
          className={`${styles.cell} ${digit ? styles.filled : ""} ${error ? styles.cellError : ""}`}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onChange={(e) => handleInput(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};

export default OtpInput;