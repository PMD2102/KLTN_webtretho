import {
  Box,
  Text,
  VStack,
  Avatar,
  Divider,
  HStack,
  Image,
  Flex,
  Button,
  Input,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { GlobalContext } from 'context/GlobalContext';
import MyModal from 'components/common/MyModal';
import http from 'utils/http';
import ToastNotify from 'components/common/ToastNotify';
import imagePath from 'utils/imagePath';

const UserInfoMenu = () => {
  const { user } = useContext(GlobalContext);
  const [isShowChangePasswordModal, setIsShowChangePasswordModal] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) return;
    http
      .post('/users/change-password', { currentPassword, newPassword })
      .then(res => {
        ToastNotify({
          title: 'Đổi mật khẩu thành công',
          status: 'success',
        });
        resetState();
        setIsShowChangePasswordModal(false);
      })
      .catch(err => {
        if (err.response?.data) {
          console.error(err.response?.data);
          ToastNotify({
            title: err.response.data,
            status: 'warning',
          });
        }
      });
  };

  const resetState = () => {
    if (currentPassword) setCurrentPassword('');
    if (newPassword) setNewPassword('');
  };

  return (
    <Box w="30%" bg="white" borderRadius="md" p="1em" textAlign="left">
      <MyModal
        isOpenModal={isShowChangePasswordModal}
        setCloseModal={setIsShowChangePasswordModal}
        title="Đổi mật khẩu"
        isCentered={false}
      >
        <Input
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          type="password"
          placeholder="Mật khẩu hiện tại"
        />
        <Input
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          my="0.5em"
          type="password"
          placeholder="Mật khẩu mới"
        />
        <HStack justify="flex-end" mt="0.5em">
          <Button
            colorScheme="gray"
            onClick={() => setIsShowChangePasswordModal(false)}
          >
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={() => handleChangePassword()}>
            Lưu
          </Button>
        </HStack>
      </MyModal>

      <VStack align="center">
        <Avatar size="2xl" name={user.username} src={imagePath(user.avatar)} />
        <Text>{user.username}</Text>
        {user?.tag && (
          <Text
            fontWeight="bold"
            fontSize="lg"
            color="red.400"
            bg="gray.200"
            p="0.5em"
            borderRadius="md"
          >
            {user.tag}
          </Text>
        )}
      </VStack>

      <Divider my="1em" />

      <Link to={`/${user.username}/ho-so`}>
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/info.png"
          />
          <Text fontWeight="600">Thông tin cá nhân</Text>
        </HStack>
      </Link>
      <Link to="/tin-nhan">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/message.png"
          />
          <Text fontWeight="600">Tin nhắn</Text>
        </HStack>
      </Link>
      <Link to="bai-viet">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/user-post.png"
          />
          <Text fontWeight="600">Bài viết</Text>
        </HStack>
      </Link>
      <Link to="/bai-viet-cho-duyet">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/icon_check_approve.png"
          />
          <Text fontWeight="600">Bài viết chờ duyệt</Text>
        </HStack>
      </Link>
      <Link to="/bai-viet-da-luu">
        {' '}
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/bookmark.png"
          />
          <Text fontWeight="600">Bài viết đã lưu</Text>
        </HStack>
      </Link>
      {/* <Link to="cong-dong-tham-gia">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/user-community.png"
          />
          <Text fontWeight="600">Cộng đồng đã tham gia</Text>
        </HStack>
      </Link> */}
      <Link to="/binh-luan">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/user-comment.png"
          />
          <Text fontWeight="600">Bình luận</Text>
        </HStack>
      </Link>
      <Link to="/binh-luan-cho-duyet">
        {' '}
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/cmt_pending.png"
          />
          <Text fontWeight="600">Bình luận chờ duyệt</Text>
        </HStack>
      </Link>

      <Divider my="1em" />

      <Flex align="center" justify="center">
        <Button
          bg="blue.700"
          color="white"
          fontWeight="600"
          _hover={{ bg: 'blue.600' }}
          onClick={() => setIsShowChangePasswordModal(true)}
        >
          Đổi mật khẩu
        </Button>
      </Flex>
    </Box>
  );
};

export default UserInfoMenu;
