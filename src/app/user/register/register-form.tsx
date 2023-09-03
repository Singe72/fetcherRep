"use client";

import {
    RegisterUserInput,
    RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { apiRegisterUser } from "@/lib/api-requests";
import FormInput from "@/components/inputs/FormInput";
import Link from "next/link";
import { useStore } from "@/store";
import { handleApiError } from "@/lib/helpers";
import {toast, Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const store = useStore();
    const router = useRouter();

    const methods = useForm<RegisterUserInput>({
        // @ts-ignore
        resolver: zodResolver(RegisterUserSchema),
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful },
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    async function RegisterUserFunction(credentials: RegisterUserInput) {
        store.setRequestLoading(true);
        try {
            const user = await apiRegisterUser(JSON.stringify(credentials));

            toast.success("Registered successfully! You will be redirected to login page...");
            await new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });

            store.setAuthUser(user);
            return router.push("/user/login");
        } catch (error: any) {
            if (error instanceof Error) {
                handleApiError(error);
            } else {
                toast.error(error.message);
                console.log("Error message:", error.message);
            }
        } finally {
            store.setRequestLoading(false);
        }
    }

    const onSubmitHandler: SubmitHandler<RegisterUserInput> = (values) => {
        RegisterUserFunction(values);
    };

    return (
        <>
            <Toaster />
            <FormProvider {...methods}>
                <form
                    autoComplete={"new-password"}
                    onSubmit={handleSubmit(onSubmitHandler)}
                >
                    <section className="d-flex justify-content-center align-items-start vh-100 py-5 px-3 px-md-0">
                        <div className="d-flex flex-column w-100 align-items-center">
                            <div className="shadow-lg rounded p-4 p-sm-5 bg-white form">
                                <h5 className="fw-bold text-muted">Register</h5>
                                <p className="text-muted">Join the crew!</p>

                                <FormInput label="Username" name="username" placeholder={"darkHackerFromTheFutur"} />
                                <FormInput label="Email" name="email" type="email" placeholder={"name@email.com"} />
                                <FormInput label="Password" name="password" type="password" placeholder={"Enter your password"} />
                                <FormInput label="Confirm Password" name="passwordConfirm" type="password" placeholder={"Repeat your password"} />

                                <button type="submit" className="btn btn-primary d-block w-100 my-4">Register</button>

                                <p className="d-block text-center text-muted small">
                                    Already apart of the crew?
                                    <Link href={"/user/login"} className={"text-decoration-underline ms-2"}>Login</Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </form>
            </FormProvider>
        </>
    );
}
