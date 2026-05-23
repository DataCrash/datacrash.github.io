import type { ProfileDataSource } from "../domain/contracts";
import type { ProfessionalProfile } from "../domain/models";

export class StaticProfileDataSource implements ProfileDataSource {
  getProfessionalProfile(): ProfessionalProfile {
    return {
      fullName: "Alessandro Ferreira Pereira",
      headline:
        "Senior .NET Engineer | Arquitetura de Solucoes | Modernizacao de Plataformas",
      location: "Sao Paulo, Brasil",
      lifeAndCareerSummary:
        "Minha carreira foi construida em ambientes enterprise de alta criticidade, conectando arquitetura, execucao tecnica e qualidade de entrega para gerar previsibilidade de negocio.",
      story: {
        title: "Quem sou eu na pratica",
        summary:
          "Atuo com foco em confiabilidade, modernizacao de plataformas e evolucao continua de produtos digitais. Minha abordagem combina lideranca tecnica, pragmatismo e comunicacao clara entre times tecnicos e stakeholders.",
        highlights: [
          "+15 anos em engenharia de software com foco backend",
          "Experiencia em modernizacao de legados e desenho de APIs",
          "Atuacao orientada a impacto de negocio e estabilidade operacional",
        ],
      },
      experiences: [
        {
          company: "DS3 (alocado na C&A)",
          role: "Senior .NET Engineer",
          period: "Atual",
          outcome:
            "Conduzo evolucao tecnica de sistemas criticos com foco em escalabilidade, qualidade e governanca de codigo.",
        },
        {
          company: "Projetos enterprise em diversos contextos",
          role: "Engenharia e Arquitetura de Solucoes",
          period: "Carreira",
          outcome:
            "Entregas consistentes em cenarios de integracao complexa, reduzindo risco operacional e acelerando ciclos de entrega.",
        },
      ],
      hardSkills: [
        {
          name: ".NET e C#",
          context:
            "Arquitetura, APIs e manutencao de plataformas de missao critica",
          level: "Especialista",
        },
        {
          name: "Arquitetura de Solucoes",
          context: "Definicao de estrutura tecnica com foco em evolucao segura",
          level: "Especialista",
        },
        {
          name: "Azure e Cloud",
          context: "Servicos gerenciados, observabilidade e operacao em nuvem",
          level: "Avancado",
        },
        {
          name: "Containers e Orquestracao",
          context: "Docker e Kubernetes para padronizacao de entrega",
          level: "Avancado",
        },
        {
          name: "Qualidade de Software",
          context: "Testes, revisao tecnica e praticas de engenharia",
          level: "Avancado",
        },
        {
          name: "React e TypeScript",
          context: "Interfaces estrategicas para produtos e hubs profissionais",
          level: "Intermediario",
        },
      ],
      softSkills: [
        {
          name: "Comunicacao objetiva",
          context: "Traducao de temas tecnicos para decisao de negocio",
          level: "Especialista",
        },
        {
          name: "Lideranca colaborativa",
          context:
            "Formacao de consenso tecnico entre times multidisciplinares",
          level: "Avancado",
        },
        {
          name: "Pensamento sistemico",
          context: "Leitura de impacto ponta a ponta em arquitetura e operacao",
          level: "Avancado",
        },
        {
          name: "Gestao de prioridades",
          context: "Foco no que gera valor com menor risco",
          level: "Avancado",
        },
      ],
      volunteering: {
        role: "Chefe Escoteiro",
        organization: "Movimento Escoteiro",
        summary:
          "No voluntariado escoteiro, lidero jovens e equipes em atividades que exigem planejamento, responsabilidade, disciplina e tomada de decisao em campo.",
        qualitiesApplied: [
          "Lideranca servidora e exemplo pratico",
          "Gestao de conflitos com empatia e firmeza",
          "Planejamento de atividades com seguranca e previsao de risco",
          "Comunicacao clara com perfis e idades diferentes",
        ],
        workplaceBenefits: [
          "Maior capacidade de coordenar times sob pressao",
          "Decisoes mais rapidas em cenarios de incerteza",
          "Fortalecimento de cultura de confianca e responsabilidade",
          "Melhor escuta ativa e desenvolvimento de pessoas",
        ],
      },
      routes: [
        {
          label: "Professional Hub",
          description: "Narrativa completa, dashboard tecnico e CVs",
          href: "https://datacrash.github.io/professional-hub/",
          isPrimary: true,
        },
        {
          label: "GitHub",
          description: "Projetos publicos e sinais tecnicos",
          href: "https://github.com/DataCrash",
        },
        {
          label: "LinkedIn",
          description: "Trajetoria profissional e networking",
          href: "https://www.linkedin.com/in/datacrash/",
        },
        {
          label: "CV PT-BR (PDF)",
          description: "Versao para triagem local",
          href: "https://raw.githubusercontent.com/DataCrash/professional-hub/main/public/cv/Senior_DotNet_Engineer_Alessandro_Pereira_BR.pdf",
        },
        {
          label: "Resume EN (PDF)",
          description: "Versao para avaliacao internacional",
          href: "https://raw.githubusercontent.com/DataCrash/professional-hub/main/public/cv/Senior_DotNet_Engineer_Alessandro_Pereira_EN.pdf",
        },
      ],
    };
  }
}
