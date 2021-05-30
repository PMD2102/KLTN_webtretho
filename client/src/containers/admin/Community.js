import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import LoadingPage from 'components/common/LoadingPage';
import MyModal from 'components/common/MyModal';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useState } from 'react';
import http from 'utils/http';
import imagePath from 'utils/imagePath';
import uploadFile from 'utils/uploadFile';

const Community = () => {
  const { communities, addCommunity } = useContext(GlobalContext);

  const [isShowModal, setIsShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [fileSelected, setFileSelected] = useState();
  const [introduce, setIntroduce] = useState('');

  const handleUploadImage = () => {
    uploadFile(fileSelected)
      .then(res => console.log(res))
      .catch(err => console.error(err));
  };

  const handleCreateCommunity = async () => {
    if (!name || !fileSelected) return;
    setLoading(true);

    const formData = new FormData();

    formData.append('name', name);
    formData.append('image', fileSelected);
    if (introduce) {
      formData.append('introduce', introduce);
    }

    http
      .post('/community', formData)
      .then(res => {
        addCommunity(res.data);
        setIsShowModal(false);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsShowModal(false);
        setLoading(false);
      });
  };

  return (
    <Box>
      {/* <input type="file" onChange={e => setFileSelected(e.target.files[0])} />
      <Button onClick={() => handleUploadImage()}>Upload</Button> */}
      {loading && <LoadingPage />}
      <MyModal
        isOpenModal={isShowModal}
        setCloseModal={setIsShowModal}
        title="Tạo cộng đồng mới"
        isCentered={false}
      >
        <Input
          mb="1em"
          placeholder="Tên cộng đồng"
          name={name}
          onChange={e => setName(e.target.value)}
        />
        <Box>
          <Text>Ảnh dại diện</Text>
          <input
            type="file"
            onChange={e => setFileSelected(e.target.files[0])}
          />
        </Box>

        <Textarea
          my="1em"
          placeholder="Giới thiệu về cộng đồng"
          name={introduce}
          onChange={e => setIntroduce(e.target.value)}
        />

        <HStack justify="flex-end">
          <Button colorScheme="teal" onClick={() => handleCreateCommunity()}>
            Tạo mới
          </Button>
        </HStack>
      </MyModal>

      <Button colorScheme="teal" onClick={() => setIsShowModal(true)}>
        Tạo mới
      </Button>

      <Divider my="0.5em" size="lg" colorScheme="blue" />

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên</Th>
            <Th>Ảnh đại diện</Th>
            <Th>Giới thiệu</Th>
            <Th>Số thành viên</Th>
            <Th>Số bài viết</Th>
            {/* <Th isNumeric></Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {communities.map((community, idx) => (
            <Tr>
              <Td>{idx + 1}</Td>
              <Td>{community.name}</Td>
              <Td>
                <Avatar
                  boxSize="5em"
                  name={community.name}
                  src={imagePath(community.avatar)}
                />
              </Td>
              <Td>{community.introduce}</Td>
              <Td>{community.totalMember}</Td>
              <Td>{community.totalPost}</Td>
              {/* <Td isNumeric>
                <Button bg="red.400" _hover={{ bg: 'red.200' }} color="white">
                  Delete
                </Button>
              </Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Community;
