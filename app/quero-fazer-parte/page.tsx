import FormularioAdmissao from "@/components/FormularioAdmissao";

export const metadata = {
  title: "Quero fazer parte | Capítulo José Barreto de Albuquerque N°512",
};

export default function QueroFazerPartePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-vermelho">Quero fazer parte</h1>
      <p className="mt-4 max-w-prose text-grafite/80">
        Preencha o formulário abaixo para solicitar sua admissão ao
        Capítulo José Barreto de Albuquerque N°512. Sua solicitação será
        encaminhada à comissão de análise do capítulo.
      </p>

      <div className="mt-10">
        <FormularioAdmissao />
      </div>
    </section>
  );
}
