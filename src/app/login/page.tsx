import Container from "@/components/container";
import Form from "./form";

const Login = async () => {
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
