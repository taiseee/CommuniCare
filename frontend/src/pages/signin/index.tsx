import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase"

type formInputs = {
    email: string;
    password: string;
}

export default function SignIn() {
    const router = useRouter();
    const { handleSubmit, register, formState } = useForm<formInputs>();
    const { errors, isSubmitting } = formState;

    const onSubmit = handleSubmit((data) => {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div>
                <label>Email</label>
                <input type="email"
                    {...register("email", {
                        required:'Email is required',
                    })} 
                />
            </div>
            <div>
                <label>Password</label>
                <input type="password"
                    {...register("password", {
                        required:'Password is required',
                    })} 
                />
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting && <span>Loading...</span>}
                Sign In
            </button>
        </form>
    );
}