"use client";

import React, {Dispatch, SetStateAction} from "react";
import {Controller, useFormContext} from "react-hook-form";
import CreateSelect from "react-select/creatable";
import {SelectProps} from "@/lib/types";
import {OnChangeValue} from "react-select";

type FormInputProps = {
	label: string;
	name: string;
	options: {
		value: string;
		label: string;
	}[];
	values?: {
		value: string;
		label: string;
	}[],
	setValues: Dispatch<SetStateAction<{value: string, label: string}[]>>
};

const ReactSelectInput: React.FC<FormInputProps> = (
	{
		label,
		name,
		options,
		values,
		setValues
	}
) => {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<div className="form-group">
			<label className="form-check-label form-label-light" htmlFor={"report-" + name}>{label}</label>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange } }) => (
					<CreateSelect
						isMulti={true}
						onChange={(event) => {
							setValues((values) => [...event.map((data) => data)]);
						}}
						options={options}
						value={values}
						className={"form-control form-control-light"}
					/>
				)}
			/>
			<p className={"text-danger"}>{errors[name]?.message as string}</p>
		</div>
	);
};

export default ReactSelectInput;
