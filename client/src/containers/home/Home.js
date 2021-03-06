import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  Icon,
  Avatar,
  Input,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import setTabName from 'utils/setTabName';
import ImageGrid from 'components/common/ImageGrid';
import {AiFillLike, AiOutlineLike } from 'react-icons/ai';
import {
  FaRegComment,
  FaFlag,
  FaBookmark,
  FaFacebookSquare,
} from 'react-icons/fa';
import http from 'utils/http';
import { removeAndAdd, timeSince } from 'utils';
import imagePath from 'utils/imagePath';
import convertToHTML from 'utils/convertToHTML';
import { GlobalContext } from 'context/GlobalContext';
import { useHistory, Link, useLocation } from 'react-router-dom';
import MyModal from 'components/common/MyModal';
import { MdSend } from 'react-icons/md';
import ToastNotify from 'components/common/ToastNotify';
import { REPORT_TYPE } from 'constants/keys';
import MainLayout from 'components/common/MainLayout';
import { FacebookButton } from 'react-social';
import path from 'path';

function Home() {
  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated, user, joinedCommunities, joinCommunity, quitCommunity } =
    useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isShowUserInfoModal, setIsShowUserInfoModal] = useState(false);
  const [userSelected, setUserSelected] = useState();

  const [commentInput, setCommentInput] = useState('');
  const [like, SetLike] = useState();

  useEffect(() => {
    setTabName('');

    http
      .get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));

      const postId = posts.map(post => post.id);
    http
      .get(`/posts/${postId}/like-or-unlike`)
      .then(res => {
        const { isLike } = res.data;
        SetLike(isLike);
      })
      .catch(err => console.error(err));
  }, []);

  const isJoinedCommunity = id =>
    joinedCommunities.findIndex(
      community => community.community?._id === id
    ) !== -1;

  const handleLikeOrUnlike = postId => {
    if (!isAuthenticated) alert('Please sign in');
    http
      .get(`/posts/${postId}/like-or-unlike`)
      .then(res => {
        const { isLike } = res.data;
        SetLike(isLike);
        if (typeof isLike !== 'undefined') {
          let post;
          const idx = posts.findIndex(e => {
            if (e._id === postId) {
              post = e;
              return true;
            }
            return false;
          });
          if (post) {
            if (!isLike) post.totalLike++;
            else post.totalLike--;
            setPosts(removeAndAdd(posts, post, idx));
          }
        }
      })
      .catch(err => console.error(err));
  };

  const handleCommentPost = postId => {
    if (!isAuthenticated) alert('Please sign in');
    if (!commentInput.trim()) return;
    http
      .post(`/posts/${postId}/comment`, { content: commentInput })
      .then(res => {
        // let post;
        // const idx = posts.findIndex(e => {
        //   if (e._id === postId) {
        //     post = e;
        //     return true;
        //   }
        //   return false;
        // });
        // if (post) {
        //   post.totalComment++;
        //   setPosts(removeAndAdd(posts, post, idx));
        // }
        ToastNotify({
          title: 'B??nh lu???n c???a b???n s??? ???????c admin duy???t',
          status: 'success',
        });
        setCommentInput('');
      })
      .catch(err => console.error(err));
  };

  const handleReport = (type, reportId) =>
    http
      .post('/report', { type, reportId })
      .then(res =>
        ToastNotify({ title: 'B??o c??o th??nh c??ng', status: 'success' })
      )
      .catch(err => {
        console.error(err.response);
        const errMessage = err.response?.data;
        errMessage &&
          ToastNotify({ title: errMessage.toString(), status: 'warning' });
      });

  const handleSavePost = postId =>
    http
      .post('/posts/saved', { postId })
      .then(r??? =>
        ToastNotify({ title: 'L??u b??i vi???t th??nh c??ng', status: 'success' })
      )
      .catch(err => {
        console.error(err.response);
        const errMessage = err.response?.data;
        errMessage &&
          ToastNotify({ title: errMessage.toString(), status: 'warning' });
      });

  return (
    <MainLayout>
      <MyModal
        isOpenModal={isShowUserInfoModal}
        setCloseModal={setIsShowUserInfoModal}
        isCentered={false}
      >
        <VStack align="center" justify="center">
          <Avatar
            size="2xl"
            name={userSelected?.username}
            src={imagePath(userSelected?.avatar)}
          />
          <Text>{userSelected?.username}</Text>
          {isAuthenticated ? (
              userSelected?._id === user._id ? (
                <Link to={{
                  pathname: `/${user.username}/ho-so`,
                  search:''
                }}>
                  <Button colorScheme="blue">Th??ng tin c?? nh??n</Button>
                </ Link>
              ) : (
                <HStack>
                  <Link to={{
                    pathname: '/tin-nhan',
                    search: `?user=${userSelected?._id}`
                  }}>
                    <Button colorScheme="blue">Nh???n tin</Button>
                  </Link>
                  <Button
                    colorScheme="pink"
                    onClick={() =>
                      handleReport(REPORT_TYPE.USER, userSelected?._id)
                    }
                  >
                    B??o c??o
                  </Button>
                </HStack>
              )
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => history.push('/dang-nhap')}
            >
              Nh???n tin
            </Button>
          )}
        </VStack>
      </MyModal>

      {/* list items */}
      {posts.slice(0, page * perPage).map(post => (
        <Box key={post._id} bg="white" borderRadius="md" p="0.5em" mb="1em">
          {/* header */}
          <HStack justify="space-between">
            <HStack>
              <Image
                borderRadius="md"
                boxSize="3em"
                objectFit="cover"
                src={imagePath(post.community?.avatar)}
              />

              <Box textAlign="left">
                <Link to={`/cong-dong/${post.community?._id}`}>
                  <Text fontWeight="600" color="blue.700">
                    {post.community?.name}
                  </Text>
                </Link>
                <HStack fontSize="md">
                  <Text>????ng b???i</Text>
                  <Text
                    fontWeight="600"
                    color="blue.700"
                    cursor="pointer"
                    onClick={() => {
                      setUserSelected(post.author);
                      setIsShowUserInfoModal(true);
                    }}
                  >
                    {post.author?.username}
                  </Text>
                  {post.author?.tag && (
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="red.400"
                      bg="gray.200"
                      p="0.5em"
                      borderRadius="md"
                    >
                      {post.author?.tag}
                    </Text>
                  )}
                  <Text as="sup">.</Text>
                  <Text>{timeSince(post.createdAt)}</Text>
                </HStack>
              </Box>
            </HStack>
            <Button
              size="sm"
              bg={
                !isAuthenticated
                  ? 'blue.700'
                  : isJoinedCommunity(post.community._id)
                  ? 'teal'
                  : 'blue.700'
              }
              color="white"
              my="0.5em"
              _hover={{ bg: 'blue.600' }}
              onClick={() => {
                const communityId = post.community._id;
                if (!isAuthenticated) history.push('/dang-nhap');
                if (isJoinedCommunity(communityId)) quitCommunity(communityId);
                else joinCommunity(communityId);
              }}
            >
              {!isAuthenticated
                ? 'Tham gia'
                : isJoinedCommunity(post.community._id)
                ? '???? tham gia'
                : 'Tham gia'}
            </Button>
          </HStack>

          {/* content */}
          <Box textAlign="left">
            <Link to={`/bai-viet/${post._id}`}>
              <Text fontWeight="600" fontSize="xl" color="black" mt="0.5em">
                {post.title}
              </Text>
              <Text
                fontSize="md"
                className="three-line-text"
                my="1em"
                className="three-line-text"
                dangerouslySetInnerHTML={convertToHTML(post.content)}
              ></Text>
              <ImageGrid images={post.images?.map(img => imagePath(img))} />
            </Link>
            <HStack
              borderTop="1px solid"
              borderBottom="1px solid"
              borderColor="gray.200"
              justify="space-between"
            >
              <HStack spacing="8">
                <Tooltip label="Th??ch">
                  <HStack>
                    <Box p="0.5em" onClick={() => handleLikeOrUnlike(post._id)}>
                      <Icon
                        w="2em"
                        h="2em"
                        cursor="pointer"
                        _hover={{ color: 'blue.700' }}
                        as={like ? AiOutlineLike : AiFillLike}
                      />
                    </Box>
                    <Text>{post.totalLike}</Text>
                  </HStack>
                </Tooltip>

                <Tooltip label="B??nh lu???n">
                  <HStack>
                    <Box p="0.5em">
                      <Icon
                        w="2em"
                        h="2em"
                        cursor="pointer"
                        _hover={{ color: 'blue.700' }}
                        as={FaRegComment}
                      />
                    </Box>
                    <Text>{post.totalComment}</Text>
                  </HStack>
                </Tooltip>

                <Tooltip label="L??u b??i vi???t">
                  <Box p="0.5em">
                    <Icon
                      w="2em"
                      h="2em"
                      cursor="pointer"
                      _hover={{ color: 'blue.700' }}
                      as={FaBookmark}
                      onClick={() => handleSavePost(post._id)}
                    />
                  </Box>
                </Tooltip>
                <Tooltip label="B??o c??o">
                  <Box p="0.5em">
                    <Icon
                      w="2em"
                      h="2em"
                      cursor="pointer"
                      _hover={{ color: 'blue.700' }}
                      as={FaFlag}
                      onClick={() => handleReport(REPORT_TYPE.POST, post._id)}
                    />
                  </Box>
                </Tooltip>
              </HStack>

              <Box p="0.5em">
                <FacebookButton
                  url={path.join('http://localhost:3000', location.pathname)}
                  appId="310097323900530"
                >
                  <Icon
                    w="2em"
                    h="2em"
                    cursor="pointer"
                    _hover={{ color: 'blue.700' }}
                    as={FaFacebookSquare}
                  />
                </FacebookButton>
              </Box>
            </HStack>
            {/* comments */}
            {!!post.comments?.length &&
              post.comments.map(comment => (
                <HStack key={comment._id} align="flex-start" my="0.5em">
                  <Avatar size="sm" name={comment.author.username} src={comment.author.avatar} />
                  <Box
                    flex="1"
                    p="0.5em 4em 0.5em 0.5em"
                    borderRadius="md"
                    bg="gray.100"
                    pos="relative"
                    className="comment"
                  >
                    <Text fontWeight="600">{comment.author?.username}</Text>
                    <Text>{comment.content}</Text>

                    <Box
                      d="none"
                      p="0.5em"
                      pos="absolute"
                      right="0"
                      top="50%"
                      transform="translateY(-50%)"
                      className="report-comment"
                    >
                      <Icon
                        w="2em"
                        h="2em"
                        cursor="pointer"
                        _hover={{ color: 'blue.700' }}
                        as={FaFlag}
                        onClick={() =>
                          handleReport(REPORT_TYPE.COMMENT, comment._id)
                        }
                      />
                    </Box>
                  </Box>
                </HStack>
              ))}
            {/* input comment */}
            <HStack my="0.5em">
              <Avatar size="sm" name={user.username} src={user.avatar}/>
              <Box flex="1" pos="relative">
                <Input
                  w="100%"
                  pr="2.5em"
                  borderRadius="3em"
                  placeholder="Vi???t b??nh lu???n..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                />
                <Icon
                  w="1.5em"
                  h="1.5em"
                  as={MdSend}
                  cursor="pointer"
                  _hover={{
                    color: 'teal',
                  }}
                  pos="absolute"
                  right="0.75em"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="1"
                  onClick={() => handleCommentPost(post._id)}
                />
              </Box>
            </HStack>
          </Box>
        </Box>
      ))}
      {page * perPage < posts.length && (
        <Button
          colorScheme="blue"
          fontWeight="600"
          p="0.5em"
          cursor="pointer"
          onClick={() =>
            page * perPage < posts.length && setPage(preState => ++preState)
          }
        >
          Xem th??m
        </Button>
      )}
    </MainLayout>
  );
}

export default Home;
