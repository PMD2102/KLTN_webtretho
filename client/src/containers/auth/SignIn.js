import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import setTabName from 'utils/setTabName';
import { useForm } from 'react-hook-form';
import http from 'utils/http';
import jwtDecode from 'jwt-decode';
import { GlobalContext } from 'context/GlobalContext';
import ToastNotify from 'components/common/ToastNotify';
import FacebookSignIn from './FacebookSignIn';

const SignIn = () => {
  const { setCurrentUser } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = data => {
    if (!Object.keys(errors).length) {
      http
        .post('/users/sign-in', data)
        .then(res => {
          const { token } = res.data;
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);
          setCurrentUser(decoded);
        })
        .catch(err => {
          console.log(err);
          let errMessage = err.response?.data;
          if (errMessage) {
            ToastNotify({
              title: errMessage.toString(),
              status: 'warning',
            });
          }
        });
    }
  };

  useEffect(() => {
    setTabName('Đăng nhập');
  }, []);

  return (
    <Box bg="white" w="30em" p="1em" textAlign="left" borderRadius="md">
      <Text fontSize="2xl" fontWeight="800">
        Đăng nhập
      </Text>
      <Text fontSize="md">
        Tham gia chia sẻ cùng cộng đồng phụ nữ lớn nhất Việt Nam
      </Text>

      <form onSubmit={handleSubmit(handleSignIn)}>
        <Box pos="relative" pb="0.5em">
          <Input
            id="username"
            {...register('username', { required: true, maxLength: 18 })}
            my="0.5em"
            placeholder="Tên đăng nhâp"
          />
          {errors.username && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.username?.type === 'required'
                ? 'Username is required'
                : errors.username?.type === 'maxLength'
                ? 'Username is must less than 18 characters'
                : ''}
            </Text>
          )}
        </Box>
        <Box pos="relative" pb="0.5em">
          <Input
            id="password"
            {...register('password', { required: true, maxLength: 20 })}
            my="0.5em"
            type="password"
            placeholder="Mật khẩu"
          />
          {errors.password && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.password?.type === 'required'
                ? 'password is required'
                : errors.password?.type === 'maxLength'
                ? 'password is must less than 20 characters'
                : ''}
            </Text>
          )}
        </Box>

        <Button
          bg="blue.700"
          color="white"
          my="0.5em"
          _hover={{ bg: 'blue.600' }}
          type="submit"
        >
          Đăng nhập
        </Button>
      </form>

      <Text fontSize="md" color="blue.800" fontWeight="800">
        Quên mật khẩu?
      </Text>
      <Divider my="0.5em" />
      <Text fontSize="md">Hoặc đăng nhập qua</Text>
      <FacebookSignIn />

      <HStack fontSize="md">
        <Text>Bạn chưa có tài khoản Webtretho?</Text>
        <Link to="/dang-ky">
          <Text fontWeight="600">Đăng ký</Text>
        </Link>
      </HStack>
    </Box>
  );
};

export default SignIn;
