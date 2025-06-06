import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Bits - Pagamento Concluído",
  description:
    "Uma nova forma de viver o CS2. Aposte, desafie e interaja enquanto assiste seu streamer favorito.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
