import { Avatar, Box, Button, HStack, Text } from '@chakra-ui/react';
import ImageGrid from 'components/common/ImageGrid';
import LoadingPage from 'components/common/LoadingPage';
import MainLayout from 'components/common/MainLayout';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { timeSince } from 'utils';
import convertToHTML from 'utils/convertToHTML';
import http from 'utils/http';
import imagePath from 'utils/imagePath';

const DetailPost = () => {
  const { postId } = useParams();
  const history = useHistory();

  const { isAuthenticated, joinedCommunities, joinCommunity, quitCommunity } = useContext(GlobalContext);

  const [post, setPosts] = useState();

  useEffect(() => {
    if (postId)
      http
        .get(`/posts/${postId}`)
        .then(res => setPosts(res.data))
        .catch(error => console.error(error));
  }, [postId]);

  const isJoinedCommunity = id =>
    joinedCommunities.findIndex(
      community => community.community?._id === id
    ) !== -1;

  return (
    <MainLayout>
      {post ? (
        <Box bg="white" borderRadius="md">
          <HStack
            justify="space-between"
            p="0.5em 1em"
            borderBottom="1px solid"
          >
            <HStack>
              <Avatar
                name={post.community?.name}
                src={imagePath(post.community?.avatar)}
              />
              <Text fontSize="xl" fontWeight="bold">
                {post.community?.name}
              </Text>
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
                ? 'Đã tham gia'
                : 'Tham gia'}
            </Button>
          </HStack>
          <Box textAlign="left" p="0.5em 1em">
            <HStack>
              <Avatar
                name={post.author?.username}
                src={imagePath(post.author?.avatar)}
              />

              <Box textAlign="left">
                <Text fontWeight="600" color="blue.700" cursor="pointer">
                  {post.author?.username}
                </Text>
                <Text fontSize="xs">{timeSince(post.createdAt)}</Text>
              </Box>
            </HStack>

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
          </Box>
        </Box>
      ) : (
        <LoadingPage />
      )}
    </MainLayout>
  );
};

export default DetailPost;
