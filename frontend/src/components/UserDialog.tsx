import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { UserService } from "../services/UserServices";

interface UserDialogProps {
  onSuccess: () => void;
}

export function UserDialog({ onSuccess }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanCpf = cpf.replace(/\D/g, "");

    try {
      await UserService.create({
        name,
        cpf: cleanCpf,
        birthDate,
        password,
        role: "USER",
      });

      setName("");
      setCpf("");
      setBirthDate("");
      setPassword("");
      setOpen(false);

      onSuccess();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário. Verifique se o CPF já existe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F44336] hover:bg-[#D32F2F] text-[#FFFFFF] shadow-sm border-none">
          + Novo Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-[#FFFFFF] border-[#0A0A0A]/10">
        <DialogHeader>
          <DialogTitle className="text-[#0A0A0A]">
            Cadastrar Novo Usuário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#0A0A0A]/80">
              Senha Provisória
            </Label>
            <Input
              id="password"
              type="text"
              placeholder="Ex: senha123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#0A0A0A]/20 focus-visible:ring-[#F44336]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0A0A0A]/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-[#0A0A0A] hover:bg-[#0A0A0A]/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0A0A0A] hover:bg-[#0A0A0A]/80 text-[#FFFFFF]"
            >
              {loading ? "Salvando..." : "Salvar Usuário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
