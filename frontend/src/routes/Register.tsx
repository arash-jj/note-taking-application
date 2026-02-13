import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5500/api/auth";

const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
});

export default function Register() {
    const navigate = useNavigate();
    const handleSubmit = async (values: { email: string; password: string }, { setSubmitting, setFieldError, resetForm }: any) => {
        try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
            if (data?.message) setFieldError("email", data.message);
            else setFieldError("email", "Registration failed");
        } else {
            resetForm();
            navigate("/login", { replace: true });
        }
        } catch (err) {
            setFieldError("email", "Network error");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-lg bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <h2 className="text-2xl font-semibold mb-4">Create account</h2>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <label className="block text-sm">
                        <div className="mb-1 text-sm font-medium">Email</div>
                        <Field name="email" type="email" placeholder="you@example.com" className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-700" />
                        <div className="text-sm text-red-600 mt-1"><ErrorMessage name="email" /></div>
                    </label>
                    <label className="block text-sm">
                        <div className="mb-1 text-sm font-medium">Password</div>
                        <Field name="password" type="password" placeholder="••••••" className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-700" />
                        <div className="text-sm text-red-600 mt-1"><ErrorMessage name="password" /></div>
                    </label>
                    <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-sky-600 text-white px-4 py-2 hover:opacity-95 disabled:opacity-60">
                        {isSubmitting ? "Creating…" : "Create account"}
                    </button>
                </Form>
                )}
            </Formik>
        </div>
    );
}
