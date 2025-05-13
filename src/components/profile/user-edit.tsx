"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users } from "@/schemas/users.schema";
import { Streamer } from "@/schemas/streamer.schema";

interface UserEditProps {
  userData: Users;
  streamerData: Streamer;
  onSave: () => void;
}

export function UserEdit({ userData, streamerData, onSave }: UserEditProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: userData.username,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar perfil");
      }

      queryClient.invalidateQueries({ queryKey: ["userData"] });

      toast.success("Perfil atualizado", {
        description: "Suas informações foram atualizadas com sucesso.",
      });

      onSave();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil", {
        description:
          error instanceof Error ? error.message : "Erro ao atualizar perfil",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {userData.role === "streamer" && (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">
            Informações de Streamer
          </h3>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username_id">Nome de Streamer</Label>
              <Input
                id="username_id"
                name="username_id"
                value={formData.username_id}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stream_url">URL da Stream</Label>
              <Input
                id="stream_url"
                name="stream_url"
                type="url"
                value={formData.stream_url}
                onChange={handleChange}
                placeholder="https://twitch.tv/seu-canal"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSave}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
