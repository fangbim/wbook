import { kavoon } from "@/lib/fonts";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Avatar, Menu } from "@mantine/core";
import { IoLogOutOutline, IoPeopleOutline } from "react-icons/io5";
import { RiBookShelfLine } from "react-icons/ri";
import { LuBookPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

type NavbarProps = {
  cta?: {
    label: string;
    href: string;
  };
  user?: {
    name?: string;
    avatarUrl?: string;
  };
};
export default function Navbar({ cta, user }: NavbarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
      signOut({ redirect: false }).then(() => {
        router.push("/signin");
      });
    };


  return (
    <nav className="flex items-center justify-between w-full px-4 sm:px-6 md:px-12 lg:px-24 py-6 sm:py-8 lg:py-12">
      <Link href={"/collection"}>
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${kavoon.className}`}
        >
          WBook
        </h1>
      </Link>

      {user && session && status ? (
        <div className="relative group">
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              {session.user.image ? (
                <Image
                  src={
                    session.user?.image ||
                    user.avatarUrl ||
                    "/avatars/default.jpg"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  width={40}
                  height={40}
                />
              ) : (
                <Avatar radius="xl" src={null} alt="no image here" color="indigo"/>
              )}
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Menu</Menu.Label>
              <Link href="/profile">
                <Menu.Item leftSection={<IoPeopleOutline size={14} />}>
                  Profile
                </Menu.Item>
              </Link>
              <Link href="/collection">
                <Menu.Item leftSection={<RiBookShelfLine size={14} />}>
                  My Collection
                </Menu.Item>
              </Link>
              <Link href="/collection/add-book">
                <Menu.Item leftSection={<LuBookPlus size={14} />}>
                  Add Book Manually
                </Menu.Item>
              </Link>
               

              <Menu.Divider />

              <Menu.Label></Menu.Label>
              
              <Menu.Item
                onClick={handleSignOut}
                color="red"
                leftSection={<IoLogOutOutline size={14} />}
              >
                Sign Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ) : (
        <Link
          href={cta?.href || "#"}
          className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-white font-semibold bg-[#212121] rounded-full focus:outline-none focus:ring-2"
        >
          {cta?.label}
        </Link>
      )}
    </nav>
  );
}
