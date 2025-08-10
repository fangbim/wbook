import { Tooltip, Text, Paper, Box, Image } from "@mantine/core";
import { useState } from "react";

type BookCoverProps = {
  src: string;
  title: string;
  author: string;
  onClick?: () => void;
};

export default function BookCover({
  src,
  title,
  author,
  onClick,
}: BookCoverProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ${
        onClick ? "hover:scale-[1.02]" : ""
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Paper
        radius="md"
        className={`overflow-hidden transition-all duration-300${
          isHovered 
            ? "shadow-xl shadow-gray-200/60" 
            : "shadow-sm shadow-gray-100/40"
        }`}
        style={{ backgroundColor: "white" }}
      >
        {/* Book Cover Image */}
        <Box className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {!imageError ? (
            <Image
              src={src}
              alt={`Cover of ${title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              fallbackSrc="/placeholder-book.png"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center p-4 space-y-2">
                <div className="w-8 h-8 mx-auto bg-gray-300 rounded-md opacity-60" />
                <Text size="xs" c="dimmed" fw={500} className="line-clamp-2">
                  {title}
                </Text>
              </div>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div 
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`} 
          />
        </Box>

        {/* Book Details */}
        <Box p="xs" className="space-y-2">
          <Tooltip 
            label={title} 
            disabled={title.length <= 20}
            position="top"
            withArrow
          >
            <Text
              size="sm"
              fw={600}
              c="dark.8"
              lineClamp={1}
              className="leading-tight group-hover:text-gray-700 transition-colors duration-200"
            >
              {title}
            </Text>
          </Tooltip>
          
          <Tooltip 
            label={author} 
            disabled={author.length <= 20}
            position="bottom"
            withArrow
          >
            <Text
              size="xs"
              c="dimmed"
              fw={400}
              lineClamp={1}
              className="transition-colors duration-200"
            >
              {author}
            </Text>
          </Tooltip>
        </Box>
      </Paper>
    </div>
  );
}