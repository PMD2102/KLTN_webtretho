import { Box, Button, HStack, Image, Input, Text } from '@chakra-ui/react';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import uploadFile from 'utils/uploadFile';
// import history from 'utils/history';
import { useHistory } from 'react-router-dom';
import http from 'utils/http';
import { Stack } from 'immutable';
import ToastNotify from 'components/common/ToastNotify';
import imagePath from 'utils/imagePath';

const CreatePost = () => {
  const history = useHistory();
  const { getJoinedCommunities, joinedCommunities } = useContext(GlobalContext);

  useEffect(() => {
    getJoinedCommunities();
  }, []);

  const [isShowSelectCommunity, setIsShowSelectCommunity] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [imageInput, setImageInput] = useState("https://www.webtretho.com/static/img/avatar.png");
  const [title, setTitle] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [imagesSelected, setImagesSelected] = useState([]);

  const onEditorStateChange = editorState => {
    setEditorState(editorState);
  };

  const handleCreatePost = () => {
    if (!title || !selectedCommunity || !imagesSelected.length) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append(
      'content',
      JSON.stringify(convertToRaw(editorState?.getCurrentContent()))
    );
    formData.append('communityId', selectedCommunity);
    for (let i = 0; i < imagesSelected.length; i++) {
      formData.append('images', imagesSelected[i]);
    }
    http
      .post('/posts', formData)
      .then(res => {
        history.push('/bai-viet-cho-duyet');
        ToastNotify({
          title: 'Tạo bài viết thành công',
          status: 'success',
        });
      })
      .catch(err => console.log(err));
  };

  // console.log(JSON.stringify(convertToRaw(editorState?.getCurrentContent())));

  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      uploadFile(file)
        .then(res => {
          // console.log(res);
          resolve(res.filename);
        })
        .catch(err => reject(err));
    });
  }

  return (
    <Box px="10em" textAlign="left">
      <Text fontSize="2xl" fontWeight="bold">
        Tạo bài viết
      </Text>
      <Text my="0.5em">Thông tin của bạn được bảo mật tuyệt đối</Text>
      <Box py="0.5em">
        <Input
          bg="white"
          placeholder="Tiêu đề của bài"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </Box>

      <HStack mb="0.5em">
        <Image
          boxSize="2.5em"
          objectFit="cover"
          src={imageInput}
          alt="Segun Adebayo"
          borderRadius="md"
        />
        <Box flex="1" pos="relative">
          <Input
            onChange={e => false}
            value={searchInput}
            onFocus={() =>
              !isShowSelectCommunity && setIsShowSelectCommunity(true)
            }
            bg="white"
            placeholder="Tìm kiếm cộng đồng"
          />
          <Box
            d={isShowSelectCommunity ? 'block' : 'none'}
            pos="absolute"
            top="100%"
            left="0"
            right="0"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            p="0.5em"
            maxH="21em"
            overflowY="scroll"
            zIndex="999"
          >
            {joinedCommunities.map(community => ( 
              <HStack
              key={community._id}
              h="4em"
              p="0.5em"
              spacing="4"
              cursor="pointer"
              _hover={{ bg: 'gray.200' }}
              onClick={() => {
                setIsShowSelectCommunity(false);
                setSearchInput(community.community?.name);
                setImageInput(imagePath(community.community?.avatar));
                setSelectedCommunity(community.community?._id);
              }}
            >
              <Image
                boxSize="3em"
                objectFit="cover"
                borderRadius="md"
                src={imagePath(community.community.avatar)}
              />
              <Box flex="1">
                <Text fontWeight="600" className="one-line-text">
                  {community.community?.name}
                </Text>
                {/* <HStack fontSize="xs" spacing="2">
                  <Text>{community.totalMember} Thành viên</Text>
                  <Text as="sup">.</Text>
                  <Text>{community.totalPost} Bài viết</Text>
                </HStack> */}
              </Box>
            </HStack>
            ))}
          </Box>
        </Box>
      </HStack>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />

      <Box>
        <input
          type="file"
          multiple="multiple"
          onChange={e => setImagesSelected(e.target.files)}
        />
      </Box>

      <HStack mt="1em" justify="flex-end">
        <Button
          bg="white"
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn hủy thao tác?'))
              history.goBack();
          }}
        >
          Hủy
        </Button>
        <Button colorScheme="blue" onClick={() => handleCreatePost()}>
          Đăng bài
        </Button>
      </HStack>
    </Box>
  );
};

export default CreatePost;
