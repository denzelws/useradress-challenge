import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { UserService, type User } from "../services/UserServices";

import { AddressService, type Address } from "../services/AddressService";

import logo from "../assets/solution-logo.svg";

import { UserDialog } from "../components/UserDialog";

import { AddressDialog } from "../components/AddressDialog";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "addresses">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [globalAddresses, setGlobalAddresses] = useState<Address[]>([]);
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const savedUser = localStorage.getItem("solution_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setAdminName(parsed.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("solution_user");
    navigate("/");
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    else loadGlobalAddresses();
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const data = await UserService.getAll();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGlobalAddresses = async () => {
    try {
      const data = await AddressService.getAllGlobal();

      setGlobalAddresses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: number | undefined) => {
    if (!id || !window.confirm("Excluir usuário e todos os seus endereços?"))
      return;

    await UserService.delete(id);

    loadUsers();
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans text-[#0A0A0A]">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#0A0A0A]/10 bg-[#FFFFFF] px-6 shadow-sm">
        <img
          src={logo}
          alt="Solution Logo"
          className="h-8 w-auto cursor-pointer"
          onClick={() => setActiveTab("users")}
        />

        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("users")}
            className={`text-sm font-medium ${activeTab === "users" ? "text-[#F44336] bg-[#F44336]/5" : "text-[#0A0A0A]/60"}`}
          >
            Usuários
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveTab("addresses")}
            className={`text-sm font-medium ${activeTab === "addresses" ? "text-[#F44336] bg-[#F44336]/5" : "text-[#0A0A0A]/60"}`}
          >
            Endereços
          </Button>

          <div className="flex items-center gap-4 ml-2 border-l pl-4 border-[#0A0A0A]/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#0A0A0A] leading-none">
                {adminName}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-[#F44336] hover:bg-[#F44336]/10 h-8 text-xs font-semibold"
            >
              Sair
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">
                {activeTab === "users"
                  ? "Gestão de Usuários"
                  : "Visão Global de Endereços"}
              </h2>

              <p className="text-[#0A0A0A]/60 mt-1">
                {activeTab === "users"
                  ? "Gerencie os clientes cadastrados."
                  : "Todos os endereços registrados no sistema."}
              </p>
            </div>

            {activeTab === "users" && <UserDialog onSuccess={loadUsers} />}
          </div>

          <Card className="shadow-sm border-[#0A0A0A]/10 bg-[#FFFFFF]">
            <CardContent className="p-0">
              {activeTab === "users" ? (
                <Table>
                  <TableHeader className="bg-[#0A0A0A]/[0.02]">
                    <TableRow>
                      <TableHead className="pl-6">Nome</TableHead>

                      <TableHead>CPF</TableHead>

                      <TableHead className="text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="pl-6 font-semibold">
                          {user.name}
                        </TableCell>

                        <TableCell>{user.cpf}</TableCell>

                        <TableCell className="text-right pr-6 space-x-2">
                          <AddressDialog
                            userId={user.id!}
                            userName={user.name}
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-[#F44336]"
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader className="bg-[#0A0A0A]/[0.02]">
                    <TableRow>
                      <TableHead className="pl-6">Endereço</TableHead>

                      <TableHead>Cidade/UF</TableHead>

                      <TableHead>Dono</TableHead>

                      <TableHead className="text-center">Tipo</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {globalAddresses.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center h-32 text-gray-400"
                        >
                          Nenhum endereço encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      globalAddresses.map((addr) => (
                        <TableRow key={addr.id}>
                          <TableCell className="pl-6 text-xs font-medium">
                            {addr.street}, {addr.number}
                          </TableCell>

                          <TableCell className="text-xs">
                            {addr.city}/{addr.state}
                          </TableCell>

                          <TableCell className="text-xs font-bold text-gray-500">
                            ID Usuário: {addr.userId}
                          </TableCell>

                          <TableCell className="text-center">
                            {addr.isMainAddress ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">
                                PRINCIPAL
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">
                                SECUNDÁRIO
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
