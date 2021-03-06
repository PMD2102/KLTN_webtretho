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
import { useForm } from 'react-hook-form';

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
  const [editorError, setEditorError] = useState(false)

  const onEditorStateChange = editorState => {
    setEditorState(editorState);
    setEditorError(true);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCreatePost = () => {
    setEditorError(true);
    if (!Object.keys(errors).length) {

      if (((convertToRaw(editorState?.getCurrentContent())).blocks[0].text) === "" || 
         ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.length) < 36 ||
         ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.split(' ').length) < 5 ) 
         return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('communityId', selectedCommunity);
    formData.append(
      'content',
      JSON.stringify(convertToRaw(editorState?.getCurrentContent()))
    );

    for (let i = 0; i < imagesSelected.length; i++) {
      formData.append('images', imagesSelected[i]);
    }

    http
      .post('/posts', formData)
      .then(res => {
        history.push('/bai-viet-cho-duyet');
        ToastNotify({
          title: 'T???o b??i vi???t th??nh c??ng',
          status: 'success',
        });
      })
      .catch(err => console.log(err));
    }
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
        T???o b??i vi???t
      </Text>
      <Text my="0.5em">Th??ng tin c???a b???n ???????c b???o m???t tuy???t ?????i</Text>
      <form onSubmit={handleSubmit(handleCreatePost)}>
        <Box pos="relative" pb="0.5em">
          <Input
            id="title"
            {...register('title', { required: true, maxLength: 100, minLength: 12})}
            bg="white"
            placeholder="Ti??u ????? c???a b??i"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
           {errors.title && (
            <Text
              pos="absolute"
              marginTop="40px"
              marginBottom="10px"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.title?.type === 'required'
                ? 'Ti??u ????? b??i vi???t l?? b???t bu???c'
                : errors.title?.type === 'minLength'
                ? 'Ti??u ????? b??i vi???t ??t nh???t 12 k?? t??? '
                : errors.title?.type === 'maxLength'
                ? 'Ti??u ????? b??i vi???t t???i ??a 100 k?? t???'
                : ''}
            </Text>
          )}
        </Box>

      <HStack my="0.7em" mb="1em">
        <Image
          boxSize="2.5em"
          objectFit="cover"
          src={imageInput}
          alt="Segun Adebayo"
          borderRadius="md"
        />
        <Box flex="1" pos="relative">
          <Input
            id="community"
            {...register('community', { required: true})}
            onChange={e => false}
            value={searchInput}
            onFocus={() =>
              !isShowSelectCommunity && setIsShowSelectCommunity(true)
            }
            bg="white"
            placeholder="T??m ki???m c???ng ?????ng"
          />
           {errors.community &&(
            <Text
              pos="absolute"
              marginTop="37px"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.community?.type === 'required' && searchInput === ""
                ? 'Ch???n c???ng ?????ng l?? b???t bu???c'
                : ''}
            </Text>
          )}
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
                setSearchInput(community.community?.name);
                setImageInput(imagePath(community.community?.avatar));
                setSelectedCommunity(community.community?._id);
                setIsShowSelectCommunity(false);
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
              </Box>
            </HStack>
            ))}
          </Box>
        </Box>
      </HStack>
      <Box pos="relative" pb="0.5em">
      <Editor
        // id="content"
        // {...register('content', { required: true, minLength: 36 })}
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
       {editorError &&(
            <Text
              pos="absolute"
              marginTop="1px"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {((convertToRaw(editorState?.getCurrentContent())).blocks[0].text) === ""
                ? 'N???i dung b??i vi???t l?? b???t bu???c'
                : ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.length) < 36
                ? 'N???i dung b??i vi???t t???i thi???u 36 k?? t???'
                : ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.split(' ').length) < 5
                ? 'N???i dung b??i vi???t t???i thi???u 5 t???'
                : ''}
            </Text>
          )}
      </Box>
      <Box pos="relative" pb="0.5em" mt="0.7em">
        <input
          id="image"
          {...register('image', { required: true})}
          type="file"
          multiple="multiple"
          onChange={e => setImagesSelected(e.target.files)}
        />
        {errors.image && (
            <Text
              pos="absolute"
              marginTop="7"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.image?.type === 'required'
                ? 'H??nh ???nh b??i vi???t l?? b???t bu???c'
                : ''}
            </Text>
          )}
      </Box>

      <HStack mt="1em" justify="flex-end">
        <Button
          bg="white"
          onClick={() => {
            if (window.confirm('B???n c?? ch???c ch???n mu???n h???y thao t??c?'))
              history.goBack();
          }}
        >
          H???y
        </Button>
        <Button colorScheme="blue" type="submit">
          ????ng b??i
        </Button>
      </HStack>
      </form>
    </Box>
  );
};

export default CreatePost;
