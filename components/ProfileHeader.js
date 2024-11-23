import Image from "next/image";

const ProfileHeader = ({ imageSrc, name, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src={`/${imageSrc}`}
        alt={name}
        className="w-48 h-48 rounded-full border-1 border-gray-300"
        width={500}
        height={500}
      />
      <h1 className="text-4xl font-bold mt-4">{name}</h1>
      <p className="text-lg text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default ProfileHeader;
