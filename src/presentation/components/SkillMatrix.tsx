import type { Skill } from "../../domain/models";

type SkillMatrixProps = {
  skills: Skill[];
};

export function SkillMatrix({ skills }: Readonly<SkillMatrixProps>) {
  return (
    <div className="skill-matrix">
      {skills.map((skill) => (
        <article key={skill.name} className="skill-card">
          <h3>{skill.name}</h3>
          <p>{skill.context}</p>
          <span className="skill-level">{skill.level}</span>
        </article>
      ))}
    </div>
  );
}
