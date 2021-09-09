/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type ImageResposeProps = {
  after: string;
  data: Image[];
};

export default function Home(): JSX.Element {
  const fetchImages = async ({
    pageParam = null,
  }): Promise<ImageResposeProps> => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage?.after || null,
  });

  const formattedData = useMemo(() => {
    const newData = data?.pages?.flatMap(item => item.data.flat());
    return newData;
  }, [data]);

  return (
    <>
      <Header />

      {isLoading && !isError ? (
        <Loading />
      ) : isError && !isLoading ? (
        <Error />
      ) : (
        <Box maxW={1120} px={20} mx="auto" my={20}>
          <CardList cards={formattedData} />

          {hasNextPage && (
            <Button
              mt="10"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
