import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLAnchorElement> & { name: string , label: string}

export const InputField: React.FC<InputFieldProps> = ({label, ...props}) => {
    const [field, {error}] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor='name'>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl> 
    )
}