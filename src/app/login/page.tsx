"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdminUser } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            setErrorMessage("الإيميل أو كلمة السر غير صحيحة");
            setIsSubmitting(false);
            return;
        }

        if (!(await isAdminUser(data.user.id))) {
            await supabase.auth.signOut();
            setErrorMessage("هذا الحساب ليس له صلاحية الدخول");
            setIsSubmitting(false);
            return;
        }

        router.replace("/");
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">تسجيل الدخول</h1>

                <label className="form-field">
                    <span className="form-label">الإيميل</span>
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        dir="ltr"
                    />
                </label>

                <label className="form-field">
                    <span className="form-label">كلمة السر</span>
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        dir="ltr"
                    />
                </label>

                {errorMessage && <p className="form-error">{errorMessage}</p>}

                <button className="primary-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الدخول..." : "دخول"}
                </button>
            </form>
        </div>
    );
}