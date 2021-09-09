import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type ImageProps = {
  title: string;
  description: string;
  url: FileList;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptFormatRegex =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: 'Arquivod e imagem obrigatório',
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: fileList =>
          acceptFormatRegex.test(fileList[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'O título deve conter mais que 2 caracteres.',
      },
      maxLength: {
        value: 20,
        message: 'O título deve conter menos que  20caracteres.',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'A descrição deve conter menos que 65 caracteres.',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (newImage: ImageProps) => {
      await api.post('api/images', {
        ...newImage,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: ImageProps): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada.',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }

      await mutation.mutateAsync(data);
      toast({
        title: 'Sucesso!',
        description: 'Imagem adicionada com sucesso.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Falha ao cadastrar.',
        description: 'Ocorreu um erro ao tentar cadastrar a imagem.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
