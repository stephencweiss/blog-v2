import fs, { Dirent } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { POSTS_DIRECTORY } from "./constants";

const postsDirectory = join(process.cwd(), POSTS_DIRECTORY);

export function getPosts() {
  return fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((file: Dirent) => file.isFile())
    .map((file: Dirent) => file.name);
}

export function getPostByFilePath(filePath: string, fields: string[] = []) {
  type Items = {
    [key: string]: string;
  };
  const fullPath = join(postsDirectory, filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (data[field]) {
      items[field] = data[field];
    }

    if (field === "content") {
      items[field] = content;
    }

    // make sure that date fields are strings
    if (data[field] instanceof Date) {
      items[field] = data[field].toISOString();
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPosts();

  const posts = slugs
    .map((slug) => getPostByFilePath(slug, fields))
    // sort posts by date in descending order
    .sort((post1: any, post2: any) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllPublicPosts(fields: string[] = []) {
  return getAllPosts(["private", "archive", "stage", ...fields])
    .filter(
      (post) =>
        !post.private &&
        !post.archive &&
        post.stage !== "draft" &&
        post.stage !== "archived"
    )
}
