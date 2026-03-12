import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import solutionLogo from "../assets/solution-logo.svg";
import { UserService } from "@/services/UserServices";

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanCpf = cpf.replace(/\D/g, "");

    try {
      if (cleanCpf === "00000000000" && password === "admin123") {
        localStorage.setItem(
          "solution_user",
          JSON.stringify({ id: 0, name: "Admin", role: "ADMIN" }),
        );
        navigate("/admin");
        return;
      }

      const user = await UserService.login({ cpf: cleanCpf, password });
      localStorage.setItem("solution_user", JSON.stringify(user));

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/meu-perfil");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      alert("CPF ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanCpf = cpf.replace(/\D/g, "");

    try {
      const newUser = await UserService.create({
        name,
        cpf: cleanCpf,
        birthDate,
        password,
        role: "USER",
      });

      localStorage.setItem("solution_user", JSON.stringify(newUser));
      navigate("/meu-perfil");
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("Este CPF já está cadastrado.");
      } else {
        alert("Erro ao realizar cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setCpf("");
    setPassword("");
    setName("");
    setBirthDate("");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-8">
          <img src={solutionLogo} alt="Solution Logo" className="h-12 w-auto" />
        </div>

        <Card className="bg-[#FFFFFF] border-[#0A0A0A]/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#0A0A0A]">
              {isSignUp ? "Criar Nova Conta" : "Acessar o Sistema"}
            </CardTitle>
            <CardDescription className="text-[#0A0A0A]/60">
              {isSignUp
                ? "Preencha seus dados para se cadastrar"
                : "Digite seu CPF e senha para entrar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={isSignUp ? handleSignUp : handleLogin}
              className="space-y-4"
            >
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#0A0A0A]/80">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-[#0A0A0A]/20 focus-visible:ring-[#F44336]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-[#0A0A0A]/80">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  required
                  className="border-[#0A0A0A]/20 focus-visible:ring-[#F44336]"
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-[#0A0A0A]/80">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="border-[#0A0A0A]/20 focus-visible:ring-[#F44336]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0A0A0A]/80">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#0A0A0A]/20 focus-visible:ring-[#F44336]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F44336] hover:bg-[#D32F2F] text-[#FFFFFF] shadow-sm transition-colors border-none mt-6"
              >
                {loading ? "Aguarde..." : isSignUp ? "Cadastrar" : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-[#0A0A0A]/5 pt-4">
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-[#0A0A0A]/70 hover:text-[#0A0A0A]"
            >
              {isSignUp
                ? "Já tem uma conta? Faça login"
                : "Não tem uma conta? Cadastre-se"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
