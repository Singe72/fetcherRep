import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
	label: string;
	name: string;
	placeholder?: string;
	value?: string;
};

const TextareaInput: React.FC<FormInputProps> = (
	{
		label,
		name,
		placeholder = "",
		value
	}
) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	return (
		<div className="form-group">
			<label className={"form-label form-label-light"} htmlFor={"register-" + name}>{label}</label>
			<textarea
				{...register(name)}
				className={"form-control form-control-light " + (errors[name] ? 'is-invalid' : '')}
				id={"register-" + name}
				placeholder={placeholder}
				autoComplete={"new-password"}
				rows={12}>{value}</textarea>
			<p className={"text-danger"}>{errors[name]?.message as string}</p>
		</div>
	);
};

export default TextareaInput;
