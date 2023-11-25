"use client";

import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {apiGetAuthUser, apiLoginUser} from "@/lib/api-requests";
import FormInput from "@/components/inputs/FormInput";
import Link from "next/link";
import { useStore } from "@/store";
import { handleApiError } from "@/lib/helpers";
import {toast, Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";
import Script from "next/script";
import useSession from "@/lib/useSession";

export default function LoginForm() {
    const store = useStore();
    const router = useRouter();
    const session = useSession();

    const methods = useForm<LoginUserInput>({
        // @ts-ignore
        resolver: zodResolver(LoginUserSchema),
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

    useEffect(() => {
        store.reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function LoginUserFunction(credentials: LoginUserInput) {
        store.setRequestLoading(true);
        try {
            await apiLoginUser(JSON.stringify(credentials));

            toast.success("Logged in successfully! You will be redirected...");
            await new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });

            const user = await apiGetAuthUser();
            store.setAuthUser(user);

            return router.push("/");
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

    const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
        LoginUserFunction(values);
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
                                <h5 className="fw-bold text-muted">Login</h5>
                                <p className="text-muted">Welcome back!</p>

                                <FormInput label="Email" name="email" type="email" />
                                <FormInput label="Password" name="password" type="password" />
                                <button type="submit" className="btn btn-primary d-block w-100 my-4">Login</button>

                                <p className="d-block text-center text-muted small">
                                    New customer?
                                    <Link href={"/user/register"} className={"text-decoration-underline ms-2"}>Sign up for an account</Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </form>
            </FormProvider>

            <Script
                type={"text/javascript"}
                src={"../../assets/js/theme.bundle.js"}
                strategy="lazyOnload"></Script>
            <Script
                type={"text/javascript"}
                src={"../../assets/js/vendor.bundle.js"}
                strategy="lazyOnload"></Script>
        </>
    );
}
