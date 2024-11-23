const LinkButton = ({ href, title, description }) => {
  return (
    <a
      href={href}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 text-gray-800 dark:text-gray-200 font-medium hover:shadow-xl transition"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
};

export default LinkButton;
