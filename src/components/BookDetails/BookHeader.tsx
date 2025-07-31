import { useBookActions } from "@/hooks/useBookActions";
import { Book } from "@/schemas/book";
import { ActionIcon, Menu } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoShareSocialOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { TiStar } from "react-icons/ti";



interface BookHeaderProps {
  book: Book;
  setIsFavorited: (isFavorited: boolean) => void;
  isFavorited: boolean;
}

const reviews = [
  {
    id: "1",
    user: { name: "Sarah W.", avatarUrl: "/avatars/sarah.jpg" },
    rating: 5,
    content:
      "An absolutely fantastic read! Couldn't put it down. The characters are so well-developed and the plot is gripping.",
  },
  {
    id: "2",
    user: { name: "David L.", avatarUrl: "/avatars/david.jpg" },
    rating: 4,
    content:
      "A very interesting perspective on the topic. Well-researched and thought-provoking, though it dragged a bit in the middle.",
  },
  {
    id: "3",
    user: { name: "Mia K.", avatarUrl: "/avatars/mia.jpg" },
    rating: 5,
    content: "This book changed my life! I highly recommend it to everyone.",
  },
];

const rating = (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);


export default function BookHeader({
  book,
  setIsFavorited,
  isFavorited,
}: BookHeaderProps) {
  const { removeFromUserCollection } = useBookActions();

  const pathname = usePathname();
  const showMenu = pathname.startsWith("/collection/books/");

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-row justify-between">
          <img
            src={book.coverUrl || "/placeholder-book.png"}
            alt="cover buku"
            width={150}
            height={220}
            className="rounded-lg shadow-lg"
          />

          <div className="flex md:hidden justify-center gap-4 mt-4">
            <Menu shadow="md" width={150} position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  size="xl"
                  radius="xl"
                  aria-label="Settings"
                >
                  <HiOutlineDotsVertical
                    style={{ width: "70%", height: "70%" }}
                  />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Link href="/profile">
                  <Menu.Item leftSection={<FaRegEdit size={14} />}>
                    Edit
                  </Menu.Item>
                </Link>
                <Link href="/collection">
                  <Menu.Item
                    onClick={(e) => {
                      e.preventDefault();
                      if (book.id) {
                        removeFromUserCollection(book.id);
                      }
                    }}
                    color="red"
                    leftSection={<MdDeleteOutline size={14} />}
                  >
                    Delete
                  </Menu.Item>
                </Link>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {book.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4 flex items-center gap-2">
            <LuUser className="w-5 h-5" />
            by {book.author}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <TiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(parseFloat(rating))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {rating} ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {book.category}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isFavorited
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaHeart
                className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
              />
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <IoShareSocialOutline className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {showMenu && (
        <div className="hidden md:block">
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                size="xl"
                radius="xl"
                aria-label="Settings"
              >
                <HiOutlineDotsVertical
                  style={{ width: "70%", height: "70%" }}
                />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Link href="/profile">
                <Menu.Item leftSection={<FaRegEdit size={14} />}>
                  Edit
                </Menu.Item>
              </Link>
              <Link href="/collection">
                <Menu.Item
                  onClick={(e) => {
                    e.preventDefault();
                    if (book.id) {
                      removeFromUserCollection(book.id);
                    }
                  }}
                  color="red"
                  leftSection={<MdDeleteOutline size={14} />}
                >
                  Delete
                </Menu.Item>
              </Link>
            </Menu.Dropdown>
          </Menu>
        </div>
        )}        
      </div>
    </div>
  );
}
