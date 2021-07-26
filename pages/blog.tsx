import Head from "next/head";
// import styles from "../styles/Home.module.css";
import { Footer } from "../components";

import { getAllPublicPosts } from "../lib/api";

type Post = any;

type Props = {
  allPosts: Post[];
};

export default function Blog({ allPosts }: Props) {
    console.log(`blogs`, allPosts)
  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="My blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to my blog!</h1>
        <ol>

          {allPosts.map((post) => (
            <li key={post.slug}>
              {JSON.stringify(post, null, 4)}
            </li>
          ))}
        </ol>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps = async () => {
  const allPosts = getAllPublicPosts([
    "title",
    "date",
    "slug",
    "published",
    "tags",
    "category",
    "stage",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return { props: { allPosts } };
};
