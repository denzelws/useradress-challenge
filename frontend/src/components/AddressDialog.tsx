import { useState, useEffect } from "react";
import axios from "axios";

import { AddressService, type Address } from "../services/AddressService";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import { toast } from "sonner";

interface AddressDialogProps {
  userId: number;
  userName: string;
  onUpdate: () => void;
}

export function AddressDialog({
  userId,
  userName,
  onUpdate,
}: AddressDialogProps) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isMainAddress, setIsMainAddress] = useState(false);

  useEffect(() => {
    const fetchCep = async () => {
      const cleanCep = zipCode.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        try {
          const response = await axios.get(
            `https://viacep.com.br/ws/${cleanCep}/json/`,
          );
          if (response.data.erro) return;
          setStreet(response.data.logradouro);
          setNeighborhood(response.data.bairro);
          setCity(response.data.localidade);
          setState(response.data.uf);
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
        }
      }
    };
    fetchCep();
  }, [zipCode]);

  useEffect(() => {
    if (open) {
      loadAddresses();
      clearForm();
      setIsAdding(false);
    }
  }, [open, userId]);

  const loadAddresses = async () => {
    try {
      const data = await AddressService.getAllByUserId(userId);
      const sortedAddresses = data.sort(
        (a, b) => Number(b.isMainAddress) - Number(a.isMainAddress),
      );
      setAddresses(sortedAddresses);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  };

  const clearForm = () => {
    setEditingAddressId(null);
    setZipCode("");
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");
    setState("");
    setIsMainAddress(false);
  };

  const handleEditClick = (addr: Address) => {
    setEditingAddressId(addr.id || null);
    setZipCode(addr.zipCode);
    setStreet(addr.street);
    setNumber(addr.number);
    setComplement(addr.complement || "");
    setNeighborhood(addr.neighborhood);
    setCity(addr.city);
    setState(addr.state);
    setIsMainAddress(addr.isMainAddress);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const addressData = {
      zipCode: zipCode.replace(/\D/g, ""),
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      isMainAddress,
    };

    try {
      if (editingAddressId) {
        await AddressService.update(userId, editingAddressId, addressData);
      } else {
        await AddressService.create(userId, addressData);
      }

      clearForm();
      setIsAdding(false);
      loadAddresses();
    } catch (error) {
      console.error("Erro ao salvar endereço", error);
      toast.error("Erro ao salvar o endereço.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (addr: Address) => {
    setAddressToDelete(addr);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete?.id) return;
    try {
      await AddressService.delete(userId, addressToDelete.id);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
      loadAddresses();
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  const handleSetMain = async (address: Address) => {
    if (!address.id) return;
    try {
      await AddressService.update(userId, address.id, {
        ...address,
        isMainAddress: true,
      });
      loadAddresses();
    } catch (error) {
      console.error("Erro ao atualizar principal", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-medium border-[#0A0A0A]/20 text-[#0A0A0A] hover:bg-[#0A0A0A]/5"
          >
            Endereços
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[750px] bg-[#FFFFFF] border-[#0A0A0A]/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0A0A0A]">
              Endereços de {userName}
            </DialogTitle>
          </DialogHeader>

          {!isAdding ? (
            <div className="space-y-4 mt-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    clearForm();
                    setIsAdding(true);
                  }}
                  className="bg-[#F44336] hover:bg-[#D32F2F] text-white h-8 text-sm border-none shadow-sm"
                >
                  + Adicionar Endereço
                </Button>
              </div>

              <Table>
                <TableHeader className="bg-[#0A0A0A]/[0.02]">
                  <TableRow>
                    <TableHead className="w-[30%]">Logradouro</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addresses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center h-24 text-[#0A0A0A]/50"
                      >
                        Nenhum endereço cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    addresses.map((addr) => (
                      <TableRow key={addr.id}>
                        <TableCell className="font-medium text-xs">
                          {addr.street}, {addr.number}{" "}
                          {addr.complement && `(${addr.complement})`}
                        </TableCell>
                        <TableCell className="text-xs">
                          {addr.city}/{addr.state}
                        </TableCell>
                        <TableCell>
                          {addr.isMainAddress ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                              Principal
                            </span>
                          ) : (
                            <span className="text-[#0A0A0A]/40 text-xs">
                              Secundário
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {!addr.isMainAddress && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetMain(addr)}
                              className="h-7 text-[10px] text-blue-600"
                            >
                              Principal
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(addr)}
                            className="h-7 text-[10px] text-gray-600"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(addr)}
                            className="h-7 text-[10px] text-[#F44336]"
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <p className="text-sm font-bold text-[#F44336] mb-2">
                {editingAddressId ? "Editando Endereço" : "Novo Endereço"}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">CEP</Label>
                  <Input
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    placeholder="00000000"
                    maxLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Logradouro</Label>
                  <Input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Número</Label>
                  <Input
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Complemento</Label>
                  <Input
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Bairro</Label>
                  <Input
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cidade</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Estado (UF)</Label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    maxLength={2}
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-center pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMainAddress}
                      onChange={(e) => setIsMainAddress(e.target.checked)}
                      className="rounded text-[#F44336]"
                    />
                    <span className="text-sm font-medium">Principal</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#0A0A0A]/10 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    clearForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0A0A0A] text-white"
                >
                  {loading
                    ? "Salvando..."
                    : editingAddressId
                      ? "Atualizar"
                      : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-[#0A0A0A]/10 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F44336] text-lg font-bold">
              Excluir endereço
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#0A0A0A]/60">
              Tem certeza que deseja excluir o endereço{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {addressToDelete?.street}, {addressToDelete?.number}
              </span>
              ? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#0A0A0A]/15 text-[#0A0A0A]/70 hover:bg-[#0A0A0A]/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="!bg-[#F44336] hover:!bg-[#D32F2F] text-white font-semibold"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
