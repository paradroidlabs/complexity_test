import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { createContext, use, useId } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  );
}

function useFormField() {
  const fieldContext = use(FormFieldContext);
  const itemContext = use(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (fieldContext == null) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({ className, ...props }: ComponentProps<"div">) => {
  const id = useId();

  return (
    <FormItemContext value={{ id }}>
      <div className={cn("x:space-y-2", className)} {...props} />
    </FormItemContext>
  );
};
FormItem.displayName = "FormItem";

const FormLabel = ({ className, ...props }: ComponentProps<typeof Label>) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "x:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};
FormLabel.displayName = "FormLabel";

const FormControl = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};
FormControl.displayName = "FormControl";

const FormDescription = ({ className, ...props }: ComponentProps<"p">) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("x:text-sm x:text-muted-foreground", className)}
      {...props}
    />
  );
};
FormDescription.displayName = "FormDescription";

const FormMessage = ({
  className,
  children,
  ...props
}: ComponentProps<"p">) => {
  const { error, formMessageId } = useFormField();

  const errorMessage = children ?? error?.message;

  if (errorMessage == null) return null;

  return (
    <p
      id={formMessageId}
      className={cn("x:text-sm x:font-medium x:text-destructive", className)}
      {...props}
    >
      {errorMessage}
    </p>
  );
};
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
