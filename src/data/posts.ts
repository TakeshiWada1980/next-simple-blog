import { Post } from "@/types";
export const posts: Post[] = [
  {
    id: 1,
    title: "記事タイトル１",
    thumbnailUrl: "https://placehold.jp/800x400.png",
    createdAt: "2023-09-11T09:00:00.000Z",
    categories: ["React", "TypeScript"],
    content: `
    本文です。本文です。本文です。本文です。本文です。本文です。<br/>本文です。本文です。本文です。本文です。本文です。<br/><br/>本文です。本文です。本文です。本文です。本文です。本文です。本文です。本文です。本文です。<br/><br/><br/>本文です。本文です。本文です。本文です。本文です。本文です。<br/>`,
  },
  {
    id: 2,
    title: "記事タイトル２",
    thumbnailUrl: "https://placehold.jp/800x400.png",
    createdAt: "2023-09-10T09:00:00.000Z",
    categories: ["HTML", "CSS"],
    content: `
    本文です。本文です。本文です。本文です。本文です。本文です。<br/>本文です。本文です。本文です。本文です。本文です。<br/><br/>本文です。本文です。本文です。本文です。本文です。本文です。本文です。本文です。本文です。<br/><br/><br/>本文です。本文です。本文です。本文です。本文です。本文です。<br/>`,
  },
  {
    id: 3,
    title: "記事タイトル３",
    thumbnailUrl: "https://placehold.jp/800x400.png",
    createdAt: "2023-09-09T09:00:00.000Z",
    categories: ["JavaScript"],
    content: `
    本文です。本文です。本文です。本文です。本文です。本文です。<br/>本文です。本文です。本文です。本文です。本文です。<br/><br/>本文です。本文です。本文です。本文です。本文です。本文です。本文です。本文です。本文です。<br/><br/><br/>本文です。本文です。本文です。本文です。本文です。本文です。<br/>`,
  },
];
