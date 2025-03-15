interface AdSpaceProps {
  width?: string;
  height?: string;
}

const AdSpace = ({ width = "728px", height = "90px" }: AdSpaceProps) => {
  return (
    <div
      className="bg-gray-200 rounded-lg flex items-center justify-center shadow-sm mx-auto"
      style={{ width, height }}
    >
      <span className="text-gray-500 text-sm">Advertisement</span>
    </div>
  );
};

export default AdSpace;
