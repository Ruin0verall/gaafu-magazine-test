interface AdSpaceProps {
  variant?: "banner" | "square" | "mobile";
}

const AdSpace = ({ variant = "banner" }: AdSpaceProps) => {
  return (
    <div
      className={`
      bg-gray-200 rounded-lg flex items-center justify-center shadow-sm mx-auto
      ${variant === "banner" ? "w-full max-w-[728px] h-[90px] md:h-[90px]" : ""}
      ${variant === "square" ? "w-full max-w-[300px] aspect-square" : ""}
      ${variant === "mobile" ? "w-full h-[100px] md:hidden" : ""}
    `}
    >
      <span className="text-gray-500 text-sm">Advertisement</span>
    </div>
  );
};

export default AdSpace;
