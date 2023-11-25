import React, {Dispatch, SetStateAction} from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
	label: string;
	name: string;
	placeholder?: string;
	checked?: boolean;
	setValue: Dispatch<SetStateAction<boolean>>;
};

const CheckboxInput: React.FC<FormInputProps> = (
	{
		label,
		name,
		placeholder = "",
		checked,
		setValue
	}
) => {
	const {
		formState: { errors },
	} = useFormContext();
	return (
		<div className="form-group">
			<div className="form-check form-switch">
				<input
					className={"form-check-input form-control-light"}
					type="checkbox"
					id={"report-" + name}
					name={"report-" + name}
					placeholder={placeholder}
					autoComplete={"new-password"}
					defaultChecked={checked}
					onChange={(event) => setValue(event.target.checked)}
				/>
				<label className="form-check-label form-label-light" htmlFor={"report-" + name}>{label}</label>
			</div>
			<p className={"text-danger"}>{errors[name]?.message as string}</p>
		</div>
	);
};

export default CheckboxInput;
