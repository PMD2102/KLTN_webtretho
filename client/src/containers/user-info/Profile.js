import {
  Avatar, Box,
  Button, Flex, HStack, Input, Radio, RadioGroup, Text, Tooltip
} from '@chakra-ui/react';
import ToastNotify from 'components/common/ToastNotify';
import { GlobalContext } from 'context/GlobalContext';
import jwtDecode from 'jwt-decode';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import http from 'utils/http';
import imagePath from 'utils/imagePath';
import uploadFile from 'utils/uploadFile';
import UserInfoLayout from './UserInfoLayout';
import UserInfoMenu from './UserInfoMenu';

const InputDatePicker = forwardRef(({ placeholder, value, onClick }, ref) => (
  <Input value={value} placeholder={placeholder} onClick={onClick} ref={ref} />
));

const userInfoType = {
  username: 0,
  name: 1,
  birth: 2,
  gender: 3,
  email: 4,
  phone: 5,
  avatar: 6,
};

const Profile = () => {
  const { user, setCurrentUser } = useContext(GlobalContext);

  const [selectedDate, setSelectedDate] = useState();
  const [birthSelectedDate, setBirthSelectedDate] = useState();
  const [userInfo, setUserInfo] = useState();

  const avatarRef = useRef();
  const avatarPreviewRef = useRef();
  const [avatarSelected, setAvatarSelected] = useState();

  useEffect(() => {
    http
      .get(`/users/${user._id}`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error(err));
  }, []);
  const handleChangeUserInfo = ({value, type }) => {
    switch (type) {
      case userInfoType.name:
        setUserInfo({ ...userInfo, name: value });
        break;
      case userInfoType.gender:
        setUserInfo({ ...userInfo, gender: value });
        break;
      case userInfoType.email:
        setUserInfo({ ...userInfo, email: value });
        break;
      case userInfoType.phone:
        setUserInfo({ ...userInfo, phone: value });
        break;
      case userInfoType.avatar:
        setUserInfo({ ...userInfo, avatar: value });
        break;
      default:
        break;
    }
  };

  const handleUpdateUserInfo = async () => {

    if (userInfo?.name === '' || 
        (userInfo?.name.split(' ').length < 2) ||
        (userInfo?.name.length > 50) ||  
        (userInfo?.phone.length < 10) 
       ) 
      return;

    http
      .put(`/users/${user._id}`, userInfo)
      .then(res => {
        ToastNotify({
          title: 'C???p nh???t th??ng tin th??nh c??ng',
          status: 'success',
        });
        const { token } = res.data;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      })
      .catch(err => console.error(err));
  };

  const handleUpdateAvatar = async () => {
    try {
      if (!avatarSelected) return;
      const { filename } = await uploadFile(avatarSelected);
      const res = await http.put(`/users/${user._id}`, { avatar: filename });
      const { token } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      }

      handleChangeUserInfo({ value: filename, type: userInfoType.avatar });
      setAvatarSelected(undefined);
      ToastNotify({
        title: 'C???p nh???t ???nh ?????i di???n th??nh c??ng',
        status: 'success',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnChange = e => {
    const file = e.target.files[0];
    setAvatarSelected(file);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      avatarPreviewRef.current.src = reader.result;
    };
    // avatarPreviewRef.current.onload = function() {
    //   URL.revokeObjectURL( avatarPreviewRef.current?.src) // free memory
    // }
  };

  return (
    <UserInfoLayout>
      <Box flex="1" textAlign="left">
        <Box bg="white" borderRadius="md" p="1em">
          <HStack spacing="4">
            <input
              type="file"
              ref={avatarRef}
              style={{ display: 'none' }}
              onChange={e => handleOnChange(e)}
            />
            <Tooltip label="T???i ???nh l??n">
              {avatarSelected ? (
                <img
                  ref={avatarPreviewRef}
                  alt="image"
                  style={{ cursor: 'pointer', maxWidth: '10em' }}
                  onClick={() => avatarRef.current?.click()}
                />
              ) : (
                <Avatar
                  size="xl"
                  name={userInfo?.username}
                  src={imagePath(userInfo?.avatar)}
                  ref={avatarPreviewRef}
                  cursor="pointer"
                  _hover={{ opacity: 0.7 }}
                  onClick={() => avatarRef.current?.click()}
                />
              )}
            </Tooltip>
            <Box>
              <Text fontWeight="600">Thay ?????i ???nh ?????i di???n c???a b???n</Text>
              <Text fontSize="xs">JPG, GIF, ho???c PNG. K??ch c??? t???i ??a 5MB</Text>
              <Button
                size="sm"
                bg="blue.700"
                color="white"
                fontWeight="600"
                _hover={{ bg: 'blue.600' }}
                onClick={() => handleUpdateAvatar()}
              >
                ????ng ???nh
              </Button>
            </Box>
          </HStack>

          {/* user's info form */}

          <Box py="0.5em">
            <Text fontWeight="600">T??n ????ng nh???p</Text>
            <Box>
              <Input
                value={userInfo?.username}
                disabled={true}
                placeholder="T??n ????ng nh???p"
              />
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">H??? v?? t??n*</Text>
            <Box pos="relative" pb="1em">
              <Input
                value={userInfo?.name}
                onChange={e =>
                  handleChangeUserInfo({
                    value: e.target.value,
                    type: userInfoType.name,
                  })}  
                placeholder="H??? v?? t??n"
              />
               {userInfo?.name && (
                <Text
                  pos="absolute"
                  left="0"
                  bottom="0"
                  as="i"
                  fontSize="xs"
                  color="red.600"
                >
                  {userInfo.name === ''
                    ? 'H??? v?? t??n l?? b???t bu???c'
                    : userInfo.name.length > 50
                    ? 'H??? v?? t??n c?? ????? d??i d??i nh???t 50 k?? t???'
                    :  userInfo.name.split(' ').length < 2
                    ? 'H??? v?? t??n ??t nh???t c?? 2 t???'
                    : ''}
                </Text>
              )}
            </Box>
          </Box>
          {/* <Box py="0.5em">
            <Text fontWeight="600">Ng??y sinh*</Text>
            <DatePicker
              selected={birthSelectedDate}
              onChange={date => setBirthSelectedDate(date)}
              placeholder="Ng??y sinh"
              customInput={<InputDatePicker />}
            />
          </Box> */}
          <Box pb="0.5em">
            <Text fontWeight="600">Gi???i t??nh</Text>
            <Box>
              <RadioGroup
                value={userInfo?.gender}
                onChange={value =>
                  handleChangeUserInfo({
                    value: +value,
                    type: userInfoType.gender,
                  })
                }
              >
                <HStack>
                  <Radio value={1}>Nam</Radio>
                  <Radio value={2}>N???</Radio>
                  <Radio value={0}>Kh??c</Radio>
                </HStack>
              </RadioGroup>
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Email*</Text>
            <Box>
              <Input
                disabled={true}
                placeholder="Email"
                value={userInfo?.email}
                onChange={e =>
                  handleChangeUserInfo({
                    value: e.target.value,
                    type: userInfoType.email,
                  })
                }
              />
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">??i???n tho???i</Text>
            <Box pos="relative" pb="1em">
              <Input
                value={userInfo?.phone}
                onChange={e =>
                  handleChangeUserInfo({
                    value: e.target.value,
                    type: userInfoType.phone,
                  })}
                placeholder="??i???n tho???i. V?? d???: 0901234567, 0351234567,..."
                type="number"
              />
              {userInfo?.phone && (
              <Text
                pos="absolute"
                left="0"
                bottom="0"
                as="i"
                fontSize="xs"
                color="red.600"
              >
                {userInfo.phone.length < 10
                  ? 'S??? ??i???n tho???i c?? ????? ??t nh???t 10 '
                  : ''}
              </Text>
              )}
            </Box>
          </Box>
          {/* <Box py="0.5em">
            <Text fontWeight="600">CMTND/CCCD/H??? chi???u</Text>
            <Box>
              <Input placeholder="CMTND/CCCD/H??? chi???u" />
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Ng??y c???p</Text>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              customInput={<InputDatePicker />}
            />
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">N??i c???p</Text>
            <Box>
              <Select defaultValue="">
                <option style={{ display: 'none' }} value="">
                  N??i c???p
                </option>
                <option value="option1">HN</option>
                <option value="option2">TP. HCM</option>
                <option value="option3">TN</option>
              </Select>
            </Box>
          </Box> */}
           <Text
            as="i"
            fontSize="sm"
            color="red.600"
          >
            * l?? nh???ng tr?????ng b???t bu???c kh??ng ???????c ????? tr???ng !!!
          </ Text>
          <Flex>
            <Button
              bg="blue.700"
              color="white"
              fontWeight="600"
              _hover={{ bg: 'blue.600' }}
              ml="auto"
              onClick={() => handleUpdateUserInfo()}
            >
              L??u
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* right side */}
      <UserInfoMenu />
    </UserInfoLayout>
  );
};

export default Profile;
