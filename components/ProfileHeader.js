const ProfileHeader = ({ imageSrc, name, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={imageSrc}
        alt={name}
        className="w-32 h-32 rounded-full border-4 border-gray-300"
      />
      <h1 className="text-4xl font-bold mt-4">{name}</h1>
      <p className="text-lg text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default ProfileHeader;
