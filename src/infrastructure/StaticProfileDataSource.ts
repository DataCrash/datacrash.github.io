import type { ProfileDataSource } from "../domain/contracts";
import type { ProfessionalProfile } from "../domain/models";

export class StaticProfileDataSource implements ProfileDataSource {
  getProfessionalProfile(): ProfessionalProfile {
    return {
      fullName: "Alessandro Ferreira Pereira",
      headline:
        "Senior .NET Engineer | Arquitetura de Soluções | Modernização de Plataformas",
      location: "São Paulo, Brasil",
      lifeAndCareerSummary:
        "Minha carreira foi construída em ambientes enterprise de alta criticidade, conectando arquitetura, execução técnica e qualidade de entrega para gerar previsibilidade de negócio.",
      story: {
        title: "Quem sou eu na prática",
        summary:
          "Atuo com foco em confiabilidade, modernização de plataformas e evolução contínua de produtos digitais. Minha abordagem combina liderança técnica, pragmatismo e comunicação clara entre times técnicos e stakeholders.",
        highlights: [
          "+15 anos em engenharia de software com foco backend",
          "Experiência em modernização de legados e desenho de APIs",
          "Atuação orientada a impacto de negócio e estabilidade operacional",
        ],
      },
      experiences: [
        {
          company: "DS3 (alocado na C&A)",
          role: "Senior .NET Engineer",
          period: "Atual",
          outcome:
            "Conduzo evolução técnica de sistemas críticos com foco em escalabilidade, qualidade e governança de código.",
        },
        {
          company: "Projetos enterprise em diversos contextos",
          role: "Engenharia e Arquitetura de Soluções",
          period: "Carreira",
          outcome:
            "Entregas consistentes em cenários de integração complexa, reduzindo risco operacional e acelerando ciclos de entrega.",
        },
      ],
      hardSkills: [
        {
          name: ".NET e C#",
          context:
            "Arquitetura, APIs e manutenção de plataformas de missão crítica",
          level: "Especialista",
        },
        {
          name: "Arquitetura de Soluções",
          context: "Definição de estrutura técnica com foco em evolução segura",
          level: "Especialista",
        },
        {
          name: "Azure e Cloud",
          context: "Serviços gerenciados, observabilidade e operação em nuvem",
          level: "Avançado",
        },
        {
          name: "Containers e Orquestração",
          context: "Docker e Kubernetes para padronização de entrega",
          level: "Avançado",
        },
        {
          name: "Qualidade de Software",
          context: "Testes, revisão técnica e práticas de engenharia",
          level: "Avançado",
        },
        {
          name: "React e TypeScript",
          context: "Interfaces estratégicas para produtos e hubs profissionais",
          level: "Intermediário",
        },
      ],
      softSkills: [
        {
          name: "Comunicação objetiva",
          context: "Tradução de temas técnicos para decisão de negócio",
          level: "Especialista",
        },
        {
          name: "Liderança colaborativa",
          context:
            "Formação de consenso técnico entre times multidisciplinares",
          level: "Avançado",
        },
        {
          name: "Pensamento sistêmico",
          context: "Leitura de impacto ponta a ponta em arquitetura e operação",
          level: "Avançado",
        },
        {
          name: "Gestão de prioridades",
          context: "Foco no que gera valor com menor risco",
          level: "Avançado",
        },
      ],
      volunteering: {
        role: "Chefe Escoteiro",
        organization: "Movimento Escoteiro",
        summary:
          "No voluntariado escoteiro, lidero jovens e equipes em atividades que exigem planejamento, responsabilidade, disciplina e tomada de decisão em campo.",
        qualitiesApplied: [
          "Liderança servidora e exemplo prático",
          "Gestão de conflitos com empatia e firmeza",
          "Planejamento de atividades com segurança e previsão de risco",
          "Comunicação clara com perfis e idades diferentes",
        ],
        workplaceBenefits: [
          "Maior capacidade de coordenar times sob pressão",
          "Decisões mais rápidas em cenários de incerteza",
          "Fortalecimento de cultura de confiança e responsabilidade",
          "Melhor escuta ativa e desenvolvimento de pessoas",
        ],
      },
      routes: [
        {
          label: "Professional Hub",
          description: "Narrativa completa, dashboard técnico e CVs",
          href: "https://datacrash.github.io/professional-hub/",
          isPrimary: true,
        },
        {
          label: "GitHub",
          description: "Projetos públicos e sinais técnicos",
          href: "https://github.com/DataCrash",
        },
        {
          label: "LinkedIn",
          description: "Trajetória profissional e networking",
          href: "https://www.linkedin.com/in/datacrash/",
        },
        {
          label: "CV PT-BR (PDF)",
          description: "Versão para triagem local",
          href: "https://raw.githubusercontent.com/DataCrash/professional-hub/main/public/cv/Senior_DotNet_Engineer_Alessandro_Pereira_BR.pdf",
        },
        {
          label: "Resume EN (PDF)",
          description: "Versão para avaliação internacional",
          href: "https://raw.githubusercontent.com/DataCrash/professional-hub/main/public/cv/Senior_DotNet_Engineer_Alessandro_Pereira_EN.pdf",
        },
      ],
    };
  }
}
