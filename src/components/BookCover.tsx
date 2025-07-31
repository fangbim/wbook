
type BookCoverProps = {
  src: string;
  title: string;
  author: string;
  onClick?: () => void;
};

export default function BookCover({ src, title, author, onClick}: BookCoverProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8"
    onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img
        src={src}
        alt="cover buku"
        width={150}
        height={150}
        className="rounded-lg shadow-lg"
      />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-xs font-thin">{author}</p>
      </div>
    </div>
  );
}
