import Link from 'next/link'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/pages/firebase";

type formInputs = {
    email: string;
    password: string;
}

export default function SignUp() {
    const router = useRouter();
    const { handleSubmit, register, formState } = useForm<formInputs>();
    const { errors, isSubmitting } = formState;

    const onSubmit = handleSubmit((data) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>SignUp</h1>
            <div>
                <label>Email</label>
                <input type="text"
                    {...register("email", {
                        required:'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email address must be formatted correctly',
                        },
                    })} 
                />
                {errors.email && <small style={{color: 'red'}}>{errors.email.message}</small>}
            </div>
            <div>
                <label>Password</label>
                <input type="password"
                    {...register("password", {
                        required:'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must have at least 6 characters',
                        },
                    })} 
                />
                {errors.password && <small style={{color: 'red'}}>{errors.password.message}</small>}
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting && <span>Loading...</span>}
                SingUp
            </button>
            <div>
                <Link href="/signin">SignInはこちら</Link>
            </div>
        </form>
    );
}