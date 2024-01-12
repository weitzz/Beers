import Container from "@/components/container";
import Form from "./form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/beer");
  }
  return (
    <Container>
      <h2 className="flex items-center justify-center mt-4 text-2xl text-slate-700">
        Login
      </h2>
      <Form />
    </Container>
  );
};

export default Login;
