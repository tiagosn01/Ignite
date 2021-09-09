import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="pGray.800" mx="auto" w="auto" h="auto" px="0">
        <ModalBody px="0" pt="0">
          <Link href={imgUrl} isExternal>
            <Image
              src={imgUrl}
              alt={`Exibindo imagem ${imgUrl}`}
              borderRadius="5px"
            />
          </Link>
        </ModalBody>

        <ModalFooter bg="pGray.800" borderRadius="5px" justifyContent="left">
          <Link href={imgUrl} isExternal>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
