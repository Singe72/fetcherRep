import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value?: string;
};

const FormInput: React.FC<FormInputProps> = (
    {
        label,
        name,
        type = "text",
        placeholder = "",
        value,
    }
) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    return (
        <div className="form-group">
            <label className={"form-label form-label-light"} htmlFor={"register-" + name}>{label}</label>
            <input
                {...register(name)}
                type={type}
                className={"form-control form-control-light " + (errors[name] ? 'is-invalid' : '')}
                id={"register-" + name}
                placeholder={placeholder}
                autoComplete={"new-password"}
                value={value} />
            <p className={"text-danger"}>{errors[name]?.message as string}</p>
        </div>
    );
};

export default FormInput;
