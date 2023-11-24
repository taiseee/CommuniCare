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
            <h1>SignIn</h1>
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
                SignIn
            </button>
            <div>
                <Link href="/signup">SignUpはこちら</Link>
            </div>
        </form>
    );
}