import { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/pages/firebase";

type formInputs = {
    email: string;
    password: string;
}

export default function SignIn() {
    const router = useRouter();
    const [signinError, setSigninError] = useState<string>(''); // 追加
    const { handleSubmit, register, formState } = useForm<formInputs>();
    const { errors, isSubmitting } = formState;

    const onSubmit = handleSubmit((data) => {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                setSigninError(error.message);
            });
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>SignIn</h1>
            <div>
                <label>Email</label>
                <input type="text"
                    {...register("email", {
                        required:'Email is required',
                    })} 
                />
                {errors.email && <small style={{color: 'red'}}>{errors.email.message}</small>}
            </div>
            <div>
                <label>Password</label>
                <input type="password"
                    {...register("password", {
                        required:'Password is required',
                    })} 
                />
                {errors.password && <small style={{color: 'red'}}>{errors.password.message}</small>}
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting && <span>Loading...</span>}
                SignIn
            </button>
            <div>
                {signinError && <span style={{color: 'red'}}>{signinError}</span>}
            </div>
            <div>
                <Link href="/signup">SignUpはこちら</Link>
            </div>
        </form>
    );
}