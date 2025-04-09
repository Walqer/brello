import { ChangeEvent, Ref } from "react";

import { Textarea as BaseTextarea, TextareaProps } from "@mantine/core";
import cn from "clsx";

import styles from "./styles.module.css";

interface Props extends TextareaProps {
  variant?: "sm" | "md";
  onValue(value: string): void;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ className, variant = "md", onValue, ref, ...rest }: Props) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => onValue(event.currentTarget.value);

  return (
    <BaseTextarea
      ref={ref}
      classNames={{
        input: cn(styles.root, styles[`variant-${variant}`]),
        wrapper: className,
      }}
      onChange={handleChange}
      {...rest}
    />
  );
}
