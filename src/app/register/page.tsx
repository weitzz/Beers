"use client";
import Button from "@/components/forms/button";
import ButtonGoogle from "@/components/forms/buttonGoogle";
import Input from "@/components/forms/input";
import useForm from "@/hooks/useForm";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const email = useForm("email");
  const password = useForm();
  const username = useForm();

  const [error, setError] = useState("");
  const userExists = useForm();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      (await email.validate()) &&
      (await password.validate()) &&
      (await username.validate())
    ) {
      const requestBody = {
        username: username.value,
        email: email.value,
        password: password.value,
      };

      const requestOptions = {
        method: "POST",
        body: JSON.stringify(requestBody),
      };

      try {
        const response = await fetch(`/api/register`, requestOptions);

        router.push("/account/login");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <div className="md:w-1/2  px-8 md:px-16">
      <h2 className="font-bold text-2xl text-slate-700">Register</h2>
      <p className="text-xs mt-4 text-slate-700">Crie sua conta agora.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="name"
          name="username"
          placeholder="Name"
          className=" mt-8 "
          {...username}
        />
        <Input type="email" name="email" placeholder="Email" {...email} />
        <div className="relative">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            {...password}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="gray"
            className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2"
            viewBox="0 0 16 16"
          >
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
          </svg>
        </div>
        <Button
          type="submit"
          className=" text-white py-2 hover:scale-105 duration-300"
        >
          Register
        </Button>

        {userExists.error && (
          <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {userExists.error}
          </div>
        )}
      </form>

      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-slate-800" />
        <p className="text-center text-sm">OU</p>
        <hr className="border-slate-800" />
      </div>

      <ButtonGoogle />

      <div className="mt-5 text-xs border-b border-slate-800 py-4 text-blue-500">
        <Link href="#">Esqueceu a senha?</Link>
      </div>

      <div className="mt-3 text-xs flex justify-between items-center ">
        <p className="text-center text-gray-600 mt-2">
          Se você possui uma conta, por favor
          <Link className="text-blue-500 hover:underline ml-2" href="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
