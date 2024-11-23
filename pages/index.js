import ProfileHeader from "components/ProfileHeader";
import Layout from "../components/Layout";
import LinkButton from "../components/LinkButton";

export default function Home() {
  const buttons = [
    {
      href: "https://github.com/Leonardo-Flores",
      title: "GitHub",
      description: "",
    },
    {
      href: "https://www.linkedin.com/in/leonardo-g-flores/",
      title: "LinkedIn",
      description: "",
    },
    {
      href: "https://www.instagram.com/leonardofloress98",
      title: "Instagram",
      description: "",
    },
    { href: "https://wa.me/+5511993090123", title: "Contato", description: "" },
  ];

  return (
    <Layout>
      <section className="flex flex-col items-center text-center mt-10">
        <ProfileHeader
          imageSrc={"profile.webp"}
          name={"Leonardo Flores"}
          description={"Software Developer"}
        />
        <div className="flex flex-col gap-4 mt-8 w-full max-w-md">
          {buttons.map((button, index) => (
            <LinkButton
              key={index}
              href={button.href}
              title={button.title}
              description={button.description}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
