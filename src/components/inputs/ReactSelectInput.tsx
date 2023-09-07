"use client";

import React, {Dispatch, SetStateAction} from "react";
import {Controller, useFormContext} from "react-hook-form";
import AsyncSelect from "react-select/async";
import {MultiValue, SingleValue} from "react-select";
import {inspect} from "util";
import Select from "react-select";

type FormInputProps = {
	label: string;
	name: string;
	multi: boolean;
	options: {
		value: string;
		label: string;
	}[];
	values?: {
		value: string;
		label: string;
	}[];
	value?: {
		value: string;
		label: string;
	},
	setValues?: Dispatch<SetStateAction<{value: string, label: string}[]>>
	setValue?: Dispatch<SetStateAction<{value: string, label: string}>>
};

const ReactSelectInput: React.FC<FormInputProps> = (
	{
		multi,
		label,
		name,
		options,
		values,
		value,
		setValues,
		setValue
	}
) => {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext();

	console.log("Options : ", options);

	return (
		<>
			<div className="form-group">
				<label className="text-white" htmlFor={"report-" + name}>{label}</label>
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange } }) => (
						<Select
							isMulti={multi}
							options={options}
							onChange={(event) => {
								if(multi)
									setValues!(
										(values) =>
											[...(event! as MultiValue<any>).map((data) => data)]);
								else
									setValue!(event! as SingleValue<any>)
							}}
							value={values ? values : value}
							className={"form-control p-0 bg-transparent"}
							styles={{
								control: (baseStyles, state) => ({
									...baseStyles,
									background: "var(--bs-dark)",
									border: "var(--bs-dark)",
									width: "300px",
									boxShadow: state.isFocused ? "0 0 0 1px var(--bs-primary)" : ''
								}),
								option: (base) => ({
									...base,
									background: "var(--bs-dark)",
									color: "var(--bs-white)",
									border: "var(--bs-dark)",
									":hover": {
										background: "var(--bs-primary)"
									}
								}),
								menu: (base) => ({
									background: "var(--bs-dark)"
								}),
							}}
						/>
					)}
				/>
			</div>
			<p className={"text-danger"}>{errors[name]?.message as string}</p>
		</>
	);
};

export default ReactSelectInput;
