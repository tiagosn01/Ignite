/* eslint-disable jsx-a11y/accessible-emoji */
import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const { next_page, results } = postsPagination;
  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState<string>(next_page);

  function loadPosts() {
    if (nextPage) {
      fetch(nextPage)
        .then(response => response.json())
        .then(data => {
          const newPosts = data.results.map((post: any) => ({
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          }));

          setNextPage(data.next_page);
          setPosts([...posts, ...newPosts]);
        })
        .catch(() => {
          alert('Erro na aplicação!');
        });
    }
  }

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>

      <Header />
      <main className={styles.contentContainer}>
        <div className={styles.hero}>
          {posts?.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data?.title}</strong>
                <p>{post.data?.subtitle}</p>
                <div>
                  <time>
                    <FiCalendar size={24} />
                    {post.first_publication_date &&
                      format(
                        new Date(post.first_publication_date),
                        'dd MMM u',
                        {
                          locale: ptBR,
                        }
                      )}
                  </time>
                  <div>
                    <FiUser size={24} />
                    <p>{post.data?.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {nextPage && (
            <button type="button" onClick={loadPosts}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 1,
    }
  );

  const { next_page, results } = response;

  const posts = results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  console.log(posts);

  return {
    props: {
      postsPagination: {
        next_page,
        results: posts,
      },
    },
    revalidate: 60 * 5,
  };
};
