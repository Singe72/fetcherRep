"use client";

import React, {Dispatch, SetStateAction} from "react";
import {Controller, useFormContext} from "react-hook-form";
import CreateSelect from "react-select/creatable";
import {SelectProps} from "@/lib/types";
import {MultiValue, OnChangeValue, SingleValue} from "react-select";

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
	dark?: boolean
};

const ReactCreatableSelectInput: React.FC<FormInputProps> = (
	{
		multi,
		label,
		name,
		options,
		values,
		value,
		setValues,
		setValue,
		dark
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
						isMulti={multi}
						onChange={(event) => {
							if(multi)
								setValues!(
									(values) =>
										[...(event! as MultiValue<any>).map((data) => data)]);
							else
								setValue!(event! as SingleValue<any>)
						}}
						options={options}
						value={values ? values : value}
						className={"form-control form-control-light"}
					/>
				)}
			/>
			<p className={"text-danger"}>{errors[name]?.message as string}</p>
		</div>
	);
};

export default ReactCreatableSelectInput;
