import Container from "@/components/container";
import Form from "./form";

const Register = async () => {
  return (
    <Container>
      <h2 className="flex items-center justify-center mt-4 text-2xl text-slate-700">
        Registar
      </h2>
      <Form />
    </Container>
  );
};

export default Register;
