export default function Historia() {
  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-[var(--ink-soft)]">
      {/* Intro editorial */}
      <p className="font-display text-[17px] font-medium italic leading-relaxed text-[var(--ink)]">
        Há histórias que começam com uma data.
        <br />
        A nossa começou com um sonho.
      </p>

      <p>
        No dia <strong className="font-semibold text-[var(--ink)]">28 de abril de 2002</strong>, sob o teto do Templo da Loja Mestre
        Francisco Correia nº 07, em Parnaíba, um novo capítulo da história da Ordem DeMolay começava a ser escrito. Naquela
        noite, era instalado o <strong className="font-semibold text-[var(--ink)]">Capítulo José Barreto de Albuquerque nº 512</strong>,
        trazendo para o norte do Piauí as luzes, os ensinamentos e os ideais da Ordem DeMolay.
      </p>

      <p>Mas uma história como essa não nasce de um único dia.</p>

      <p>
        Foram meses de trabalho, dedicação e esperança até que aquele sonho se tornasse realidade. A iniciativa partiu do
        Venerável Mestre <strong className="font-semibold text-[var(--ink)]">José Hamilton Rocha Oliveira</strong>, da Loja Fraternidade
        Parnaibana nº 840, encontrando no Venerável Mestre <strong className="font-semibold text-[var(--ink)]">Sebastião Raimundo de Sousa</strong>,
        da Loja Mestre Francisco Correia nº 07, o apoio necessário para que a primeira célula DeMolay do norte do estado pudesse
        finalmente existir.
      </p>

      <p>
        Para aquela instalação, vieram DeMolays de outras cidades do Piauí, unidos aos jovens parnaibanos em torno de um mesmo
        propósito. E, naquela noite, sete jovens tiveram seus nomes definitivamente inscritos na história do Capítulo:
      </p>

      <ul className="grid gap-1.5 rounded-xl border border-[var(--ink-faint)] bg-white p-4 sm:grid-cols-2">
        {[
          "Alan Costa Machado",
          "Diego dos Santos Oliveira",
          "Magno Silva de Aguiar",
          "Talycio Nazareth Pereira de Sousa",
          "Bruno César Véras Prado",
          "Jorlândio Ribas Moura dos Santos",
          "Lucas Henrique Portifirio Moura",
        ].map((nome) => (
          <li key={nome} className="flex gap-2 text-[14px] leading-snug text-[var(--ink)]">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/70" />
            <span className="font-medium">{nome}</span>
          </li>
        ))}
      </ul>

      <p>
        A eles se somaram dois jovens teresinenses, formando o grupo que daria os primeiros passos de uma história que continuaria
        sendo escrita por muitas outras gerações.
      </p>

      <p className="rounded-xl border-l-2 border-[var(--gold)] bg-white px-4 py-3 text-[14px] italic leading-relaxed text-[var(--ink)]">
        E talvez exista algo simbólico nisso. Assim como a Ordem DeMolay nasceu, em 1919, a partir de um pequeno grupo de jovens
        reunidos em torno de um ideal, o JBA 512 também começou pequeno — mas carregava dentro de si algo muito maior do que seus
        primeiros números poderiam revelar.
      </p>

      {/* Um nome, uma memória */}
      <h3 id="um-nome" className="scroll-mt-24 pt-2 font-display text-[18px] font-semibold leading-tight text-[var(--crimson)]">
        Um nome, uma memória
      </h3>
      <p>O nome do Capítulo não foi escolhido por acaso.</p>
      <p>
        <strong className="font-semibold text-[var(--ink)]">José Barreto de Albuquerque</strong> foi um homem cuja trajetória esteve
        profundamente ligada à Maçonaria e à cidade de Parnaíba. Natural do povoado de Caiçara, no Maranhão, dedicou sua vida ao
        trabalho e à construção. Mestre de obras e homem de múltiplos talentos, também exerceu funções na vida pública, tendo sido
        Delegado de Polícia e vereador por duas vezes.
      </p>
      <p>
        Na Maçonaria, construiu uma trajetória marcada pela dedicação às Lojas{" "}
        <strong className="font-semibold text-[var(--ink)]">Fraternidade Parnaibana nº 840</strong> e{" "}
        <strong className="font-semibold text-[var(--ink)]">Mestre Francisco Correia nº 07</strong>, chegando a ocupar o cargo de
        Venerável Mestre desta última.
      </p>
      <p>
        Seu vínculo com a Fraternidade Parnaibana e sua dedicação à Maçonaria fizeram com que seu nome ultrapassasse sua própria
        geração. Quando a Loja Fraternidade Parnaibana participou da criação de um Capítulo DeMolay em Parnaíba, encontrou uma
        forma de manter viva a memória daquele homem: dar seu nome à nova geração que começava a se formar.
      </p>
      <p>
        Assim nasceu o <strong className="font-semibold text-[var(--ink)]">Capítulo José Barreto de Albuquerque nº 512</strong>.
      </p>
      <p>
        Mais do que um nome em um brasão, José Barreto passou a representar uma ponte entre gerações — entre os homens que
        construíram a Maçonaria em Parnaíba e os jovens que chegariam para continuar construindo o futuro.
      </p>

      {/* Os primeiros passos */}
      <h3 id="primeiros-passos" className="scroll-mt-24 pt-2 font-display text-[18px] font-semibold leading-tight text-[var(--crimson)]">
        Os primeiros passos
      </h3>
      <p>Os primeiros anos foram marcados por crescimento, entusiasmo e, principalmente, fraternidade.</p>
      <p>
        O Capítulo rapidamente deixou de ser apenas uma nova organização em Parnaíba para tornar-se uma verdadeira família. As
        reuniões reuniam dezenas de jovens, e os trabalhos muitas vezes começavam cedo e atravessavam a noite.
      </p>
      <p>Vieram as cerimônias, as ações sociais, as amizades, os desafios, as conquistas e as histórias que não cabem em uma ata.</p>
      <p>O JBA cresceu.</p>
      <p>E, com ele, cresceram também os jovens que passaram por suas fileiras.</p>
      <p>
        Cada geração deixou alguma coisa. Alguns deixaram liderança. Outros, trabalho. Outros, amizade. Alguns deixaram
        ensinamentos que seriam lembrados durante décadas.
      </p>
      <p>E todos, de alguma maneira, deixaram parte de si.</p>

      {/* Muito além da sala capitular */}
      <h3 id="alem-da-sala" className="scroll-mt-24 pt-2 font-display text-[18px] font-semibold leading-tight text-[var(--crimson)]">
        Muito além da sala capitular
      </h3>
      <p>
        Desde os seus primeiros anos, o Capítulo construiu uma trajetória marcada pelo trabalho social e pela participação ativa na
        comunidade.
      </p>
      <p>
        A história registrada dos primeiros anos destaca as diversas ações realizadas e reconhecidas pela sociedade parnaibana, além
        da participação dos DeMolays em atividades e eventos da Ordem.
      </p>
      <p>
        Em <strong className="font-semibold text-[var(--ink)]">2010</strong>, por exemplo, cinco membros do JBA nº 512 fizeram parte da
        comitiva piauiense no Congresso Nacional da Ordem DeMolay — um momento significativo para a expansão das experiências e
        amizades dos DeMolays de Parnaíba.
      </p>
      <p>
        Em <strong className="font-semibold text-[var(--ink)]">2013</strong>, Parnaíba recebeu o{" "}
        <strong className="font-semibold text-[var(--ink)]">Congresso Piauiense da Ordem DeMolay</strong>, reunindo membros de
        diferentes partes do estado e contando com participação de membros do JBA. Na ocasião,{" "}
        <strong className="font-semibold text-[var(--ink)]">Rodrigo Briam</strong>, do Capítulo José Barreto de Albuquerque nº 512,
        foi eleito Mestre Conselheiro Estadual Adjunto.
      </p>
      <p>
        São momentos como esses que mostram que a história de um Capítulo não se limita às paredes de seu Templo. Ela também é
        construída nas estradas percorridas, nos congressos, nas cerimônias, nas ações sociais, nas amizades feitas e nas
        oportunidades em que um jovem percebe que faz parte de algo maior do que ele mesmo.
      </p>

      {/* Aqueles que ficaram para sempre */}
      <h3 id="aqueles-que-ficaram" className="scroll-mt-24 pt-2 font-display text-[18px] font-semibold leading-tight text-[var(--crimson)]">
        Aqueles que ficaram para sempre
      </h3>
      <p>Toda fraternidade é feita de pessoas.</p>
      <p>E algumas pessoas se tornam parte da história de maneira que o tempo não consegue apagar.</p>
      <p>
        Entre elas está o <strong className="font-semibold text-[var(--ink)]">Tio Aldemaro Araújo Barbosa Machado</strong>, que exerceu
        por anos a função de Presidente do Conselho Consultivo do Capítulo José Barreto de Albuquerque nº 512.
      </p>
      <p>
        Tio Aldemaro faleceu em <time dateTime="2007-06-23" className="font-semibold text-[var(--ink)]">23 de junho de 2007</time>, aos 62
        anos.
      </p>
      <p>Para os DeMolays de Parnaíba, entretanto, sua história não terminou naquela data.</p>
      <p>
        Ele permaneceu nas lembranças, nos conselhos, nos ensinamentos e nas histórias contadas pelas gerações que tiveram a
        oportunidade de conhecê-lo.
      </p>
      <p>
        Seu exemplo representa algo que atravessa toda a história do JBA: a certeza de que um Capítulo é construído não somente
        pelos jovens que dele fazem parte, mas também por todos aqueles que dedicam seu tempo, sua experiência e seu coração para
        ajudá-los a crescer.
      </p>

      {/* Uma história escrita por gerações */}
      <h3 id="escrita-por-geracoes" className="scroll-mt-24 pt-2 font-display text-[18px] font-semibold leading-tight text-[var(--crimson)]">
        Uma história escrita por gerações
      </h3>
      <p>Mais de duas décadas se passaram desde aquela noite de abril de 2002.</p>
      <p>Muitos nomes passaram pelo JBA 512.</p>
      <p>
        Alguns chegaram ainda adolescentes e saíram levando consigo amizades que atravessariam a juventude. Outros descobriram
        dentro do Capítulo suas primeiras experiências de liderança. Muitos aprenderam a falar em público, organizar projetos, servir
        ao próximo e assumir responsabilidades.
      </p>
      <p>Mas talvez o maior legado não esteja nos cargos ocupados ou nas conquistas registradas.</p>
      <p>Está nas pessoas.</p>
      <ul className="space-y-1.5 pl-1 text-[14px] leading-relaxed text-[var(--ink-soft)]">
        <li className="flex gap-2">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/60" />
          <span>Está naquele antigo DeMolay que hoje olha para trás e percebe que parte do homem que se tornou nasceu dentro daquela sala capitular.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/60" />
          <span>Está no Tio que, décadas depois, ainda se lembra dos jovens que acompanhou.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/60" />
          <span>Está nas famílias que acompanharam seus filhos.</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]/60" />
          <span>Está nos irmãos que, mesmo depois de deixarem as fileiras ativas, continuam carregando consigo a lembrança do JBA.</span>
        </li>
      </ul>
      <p>Porque o tempo muda as pessoas, as gestões mudam, os Mestres Conselheiros passam e novas gerações chegam.</p>
      <p>Mas aquilo que foi construído em fraternidade permanece.</p>

      {/* O JBA de ontem, de hoje e de amanhã */}
      <h3 id="ontem-hoje-amanha" className="scroll-mt-24 pt-2 font-display text-[18px] font-semibold leading-tight text-[var(--crimson)]">
        O JBA de ontem, de hoje e de amanhã
      </h3>
      <p>
        Hoje, o <strong className="font-semibold text-[var(--ink)]">Capítulo José Barreto de Albuquerque nº 512</strong> permanece
        como parte da história da Ordem DeMolay em Parnaíba e no Piauí, sendo reconhecido atualmente como um Capítulo regular da
        Ordem DeMolay.
      </p>
      <p>E talvez seja justamente essa a beleza de uma história que ainda está sendo escrita.</p>
      <p>Não existe um ponto final.</p>
      <p>
        Os sete jovens que deram os primeiros passos em 2002 não poderiam saber quantas gerações viriam depois deles. Não poderiam
        imaginar quantas amizades nasceriam, quantas famílias seriam aproximadas, quantos jovens encontrariam no JBA um lugar para
        crescer e quantas memórias seriam construídas sob o mesmo teto.
      </p>
      <p>Mas eles fizeram sua parte.</p>
      <p>Começaram.</p>
      <p>E agora cabe a cada nova geração continuar.</p>

      <div className="rounded-xl border border-[var(--gold-border)] bg-[var(--gold-faint)] px-4 py-4">
        <p className="font-display text-[15px] font-semibold leading-snug text-[var(--crimson)]">
          Porque o <span className="font-black">JBA 512 não pertence somente a quem está aqui hoje</span>.
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-soft)]">
          Ele pertence também aos que estiveram antes. Aos que acenderam as primeiras luzes. Aos que ensinaram. Aos que
          aconselharam. Aos que partiram. Aos que ainda caminham conosco. E, principalmente, àqueles que ainda chegarão.
        </p>
      </div>

      <p>
        A história do Capítulo José Barreto de Albuquerque nº 512 é, portanto, uma história de{" "}
        <strong className="font-semibold text-[var(--ink)]">juventude, fraternidade, serviço e transformação</strong>.
      </p>
      <p>Uma história construída por muitas mãos, muitos sonhos e muitas gerações.</p>
      <p>Uma história que começou em 28 de abril de 2002.</p>
      <p className="font-display text-[16px] font-semibold text-[var(--crimson)]">E que continua sendo escrita.</p>
    </div>
  );
}
