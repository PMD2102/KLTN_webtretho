import {
  Box,
  Button,
  Divider,
  HStack, Input,
  Text
} from '@chakra-ui/react';
import ToastNotify from 'components/common/ToastNotify';
import { GlobalContext } from 'context/GlobalContext';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import http from 'utils/http';
import setTabName from 'utils/setTabName';
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
          console.log(decoded);;
          setCurrentUser(decoded);
        })
        .catch(err => {
          console.log(err);
          const errMessage = err.response?.data;
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
                ? 'Tên đăng nhập  là bắt buộc'
                : errors.username?.type === 'maxLength'
                ? 'Tên đăng nhập nhỏ hơn 20 ký tự'
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
                ? 'Mật khẩu là bắt buộc'
                : errors.password?.type === 'maxLength'
                ? 'Mật khẩu  nhỏ hơn 20 ký tự'
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
