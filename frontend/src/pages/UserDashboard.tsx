import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

import { type User } from "../services/UserServices";
import { AddressService, type Address } from "../services/AddressService";

import logo from "../assets/solution-logo.svg";

import { AddressDialog } from "../components/AddressDialog";
import { formatCpfDisplay } from "@/utils/formatters";

export function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("solution_user");

    if (!savedUser) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    fetchAddresses(parsedUser.id);
  }, [navigate]);

  const fetchAddresses = async (userId: number) => {
    try {
      const data = await AddressService.getAllByUserId(userId);
      const sorted = data.sort(
        (a, b) => Number(b.isMainAddress) - Number(a.isMainAddress),
      );
      setAddresses(sorted);
    } catch (error) {
      console.error("Erro ao buscar preview de endereços:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("solution_user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col font-sans text-[#0A0A0A]">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#0A0A0A]/10 bg-[#FFFFFF] px-6 shadow-sm">
        <img src={logo} alt="Solution Logo" className="h-8 w-auto" />
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0A0A0A]">{user.name}</p>
            <p className="text-xs text-[#0A0A0A]/50 capitalize">
              {user.role?.toLowerCase()}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-[#F44336] hover:bg-[#F44336]/10 h-9"
          >
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
              Bem-vindo, {user.name.split(" ")[0]}!
            </h2>
            <p className="text-[#0A0A0A]/60">
              Aqui você pode gerenciar seus dados pessoais e endereços de
              entrega.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 shadow-sm border-[#0A0A0A]/10 bg-[#FFFFFF] h-fit">
              <CardHeader className="border-b border-[#0A0A0A]/5">
                <CardTitle className="text-lg">Meus Dados</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]/40">
                    CPF
                  </label>
                  <p className="font-medium text-[#0A0A0A]">
                    {formatCpfDisplay(user.cpf)}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]/40">
                    Data de Nascimento
                  </label>
                  <p className="font-medium text-[#0A0A0A]">
                    {new Date(user.birthDate).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 shadow-sm border-[#0A0A0A]/10 bg-[#FFFFFF]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#0A0A0A]/5 pb-4">
                <div>
                  <CardTitle className="text-lg text-[#0A0A0A]">
                    Endereços
                  </CardTitle>
                  <CardDescription>
                    Gerencie seus locais de entrega
                  </CardDescription>
                </div>

                <AddressDialog
                  userId={user.id!}
                  userName="meu perfil"
                  onUpdate={() => fetchAddresses(user.id!)}
                />
              </CardHeader>

              <CardContent className="pt-6 pb-6">
                {addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <div className="bg-[#F4F4F5] p-4 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#0A0A0A]/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0A0A0A]">
                      Nenhum endereço cadastrado
                    </h3>
                    <p className="text-xs text-[#0A0A0A]/50 max-w-[250px] mt-1">
                      Clique no botão acima para adicionar seu primeiro
                      endereço.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="flex items-center justify-between p-4 border border-[#0A0A0A]/10 rounded-lg bg-[#F4F4F5]/30 hover:bg-[#F4F4F5] transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#0A0A0A]">
                            {addr.street}, {addr.number}{" "}
                            {addr.complement && `(${addr.complement})`}
                          </p>
                          <p className="text-xs text-[#0A0A0A]/60 mt-0.5">
                            {addr.neighborhood} - {addr.city}/{addr.state} •
                            CEP:{" "}
                            {addr.zipCode.replace(/^(\d{5})(\d{3})$/, "$1-$2")}
                          </p>
                        </div>
                        {addr.isMainAddress && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
