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
  const fullPath = join(postsDirectory, filePath);
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    type Items = {
      [key: string]: string;
    };

    const items: Items = {};

    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
      if (field === "slug") {
        items[field] = filePath;
      }
      if (field === "content") {
        items[field] = content;
      }

      if (data[field]) {
        items[field] = data[field];
      }
    });

    return items;
  } catch (error) {
    console.log(`ERROR -- couldn't get ${fullPath}\n`, { error });
  }
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPosts();

  const posts = slugs.map((slug) => getPostByFilePath(slug, fields));
  // sort posts by date in descending order
  //   .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
