import { Kavoon, Karma, Lato } from "next/font/google";
export const kavoon = Kavoon({
    subsets: ['latin'], 
    weight: '400',
});

export const karma = Karma({
    subsets: ['latin'],
    weight: [ '300', '400', "500", "600", "700"],
});

export const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700'],
});